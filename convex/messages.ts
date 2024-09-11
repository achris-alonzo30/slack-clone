import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { mutation, query, QueryCtx } from "./_generated/server";


const populateUser = (
    ctx: QueryCtx,
    userId: Id<"users">,
) => {
    return ctx.db.get(userId);
}

const populateReactions = (
    ctx: QueryCtx,
    messageId: Id<"messages">,
) => {
    return ctx.db
        .query("reactions")
        .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
        .collect();
}

const populateMember = (
    ctx: QueryCtx,
    memberId: Id<"members">,
) => {
    return ctx.db.get(memberId);
}

const populateThread = async (
    ctx: QueryCtx,
    messageId: Id<"messages">,
) => {
    const messages = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
        .collect();

    if (messages.length === 0) {
        return {
            count: 0,
            timestamp: 0,
            image: undefined,
        }
    }

    const lastMessage = messages[messages.length - 1];
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

    if (!lastMessageMember) {
        return {
            count: 0,
            timestamp: 0,
            image: undefined,
        }
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timestamp: lastMessage._creationTime,
    }

}

const getMember = async (
    ctx: QueryCtx,
    userId: Id<"users">,
    workspaceId: Id<"workspaces">,
) => {
    return ctx.db
        .query("members")
        .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique();
}

export const get = query({
    args: {
        paginationOpts: paginationOptsValidator,
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        let _conversationId = args.conversationId;

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found!");
            }

            _conversationId = parentMessage.conversationId;
        }

        const results = await ctx.db
            .query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q.eq("channelId", args.channelId)
                    .eq("parentMessageId", args.parentMessageId)
                    .eq("conversationId", _conversationId)
            )
            .order("desc")
            .paginate(args.paginationOpts);


        return {
            ...results,
            page: (
                await Promise.all(
                    results.page.map(async (message) => {
                        const member = await populateMember(ctx, message.memberId);
                        const user = member ? await populateUser(ctx, member.userId) : null;

                        if (!member || !user) return null;

                        const reactions = await populateReactions(ctx, message._id);
                        const thread = await populateThread(ctx, message._id);
                        const image = message.image ?
                            await ctx.storage.getUrl(message.image) : undefined;

                        const reactionsWithCounts = reactions.map((reaction) => {
                            return {
                                ...reaction,
                                count: reactions.filter((r) => r.value === reaction.value).length,
                            }
                        });

                        const dedupedReactions = reactionsWithCounts.reduce((acc, reaction) => {
                            const existingReaction = acc.find((r) => {
                                r.value === reaction.value;
                            })

                            if (existingReaction) {
                                existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                            } else {
                                acc.push({
                                    ...reaction,
                                    memberIds: [reaction.memberId],
                                })
                            }

                            return acc;
                        },
                            [] as (Doc<"reactions"> & {
                                count: number;
                                memberIds: Id<"members">[];
                            })[]
                        );

                        // Remove memberId property from reactions
                        const reactionsWithoutMemberIdProperty = dedupedReactions.map(({ memberId, ...rest }) => rest);

                        return {
                            ...message,
                            user,
                            image,
                            member,
                            threadCount: thread.count,
                            threadImage: thread.image,
                            threadTimestamp: thread.timestamp,
                            reactions: reactionsWithoutMemberIdProperty,
                        }
                    })
                )
            ).filter(
                (message): message is NonNullable<typeof message> => message !== null
            )
        }
    }
})

export const create = mutation({
    args: {
        body: v.string(),
        workspaceId: v.id("workspaces"),
        image: v.optional(v.id("_storage")),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const member = await getMember(ctx, userId, args.workspaceId);

        if (!member) {
            throw new Error("User is not a member of the workspace!")
        }

        let _conversationId = args.conversationId;

        // Only possible if we are replying in a thread in 1:1 conversation
        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);

            if (!parentMessage) {
                throw new Error("Parent message not found!");
            }

            _conversationId = parentMessage.conversationId;
        }

        const messageId = await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            memberId: member._id,
            channelId: args.channelId,
            workspaceId: args.workspaceId,
            conversationId: _conversationId,
            parentMessageId: args.parentMessageId,
        });

        return messageId;
    }
});

export const update = mutation({
    args: {
        body: v.string(),
        id: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const message = await ctx.db.get(args.id);

        if (!message) {
            throw new Error("Message not found!");
        }

        const member = await getMember(ctx, userId, message.workspaceId);

        if (!member || member._id !== message.memberId) {
            throw new Error("User is not the author of the message!");
        }

        await ctx.db.patch(args.id, {
            body: args.body,
            updatedAt: Date.now(),
        });

        return args.id;
    }
})