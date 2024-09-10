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

        return await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            memberId: member._id,
            updatedAt: Date.now(),
            channelId: args.channelId,
            workspaceId: args.workspaceId,
            parentMessageId: args.parentMessageId,
        });
    }
})