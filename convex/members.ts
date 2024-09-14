import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { query, QueryCtx } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

const populateMember = (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}


export const get = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) return null;

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", q => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member) return null;

        return member;
    }
})

export const getById = query({
    args: { memberId: v.id("members") },
    handler: async (ctx, { memberId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) return null;

        const member = await ctx.db.get(memberId);

        if (!member) return null;

        const currentMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", q => q.eq("workspaceId", member.workspaceId).eq("userId", userId))
            .unique();
        
        if (!currentMember) return null

        const user = await populateMember(ctx, member.userId);

        if (!user) return null;

        return {
            ...member,
            user
        }
    }
})

export const getAll = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) return [];

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", q => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member) return [];

        const data = await ctx.db
            .query("members")
            .withIndex("by_workspace_id", q => q.eq("workspaceId", workspaceId))
            .collect();

        const members = [];

        for (const member of data) {
            const user = await populateMember(ctx, member.userId);

            if (user) {
                members.push({
                    ...member,
                    user
                })
            }
        }

        return members;
    }
})