import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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