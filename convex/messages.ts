import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
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

        return await ctx.db
            .query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q.eq("channelId", args.channelId)
                    .eq("parentMessageId", args.parentMessageId)
                    .eq("conversationId", _conversationId)
            )
            .order("desc")
            .paginate(args.paginationOpts);
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
            updatedAt: Date.now(),
            channelId: args.channelId,
            workspaceId: args.workspaceId,
            conversationId: _conversationId,
            parentMessageId: args.parentMessageId,
        });

        return messageId;
    }
})