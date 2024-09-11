import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, QueryCtx } from "./_generated/server";

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

export const toggle = mutation({
    args: {
        value: v.string(),
        messageId: v.id("messages"),
    },
    handler: async (ctx, { value, messageId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const message = await ctx.db.get(messageId);

        if (!message) {
            throw new Error("Message not found");
        }

        const member = await getMember(ctx, userId, message.workspaceId);

        if (!member) {
            throw new Error("Member not found");
        }

        const existingMessageReactionFromUser = await ctx.db
            .query("reactions")
            .filter((q) => q.and(
                q.eq(q.field("messageId"), messageId),
                q.eq(q.field("memberId"), member._id),
                q.eq(q.field("value"), value)
            ))
            .first();

        if (existingMessageReactionFromUser) {
            await ctx.db.delete(existingMessageReactionFromUser._id);

            return existingMessageReactionFromUser._id
        } else {
            return await ctx.db.insert("reactions", {
                value,
                memberId: member._id,
                messageId: message._id,
                workspaceId: message.workspaceId,
            });
        };

    }
})