import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const get = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) return [];

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member) return [];

        const channels = await ctx.db
            .query("channels")
            .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
            .collect();

        return channels;
    }
});

export const getById = query({
    args: {
        channelId: v.id("channels"),
    },
    handler: async (ctx, { channelId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) return null;

        const channel = await ctx.db.get(channelId);

        if (!channel) return null;
        
        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", channel.workspaceId).eq("userId", userId))
            .unique();

        if (!member) return null;

        return channel;
    }
})

export const create = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId, name }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) throw new Error("Unauthorized");

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") throw new Error("Unauthorized");

        const parsedName = name.replace(/\s+/g, "-").toLowerCase();

        const channelId = await ctx.db.insert("channels", {
            name: parsedName,
            workspaceId,
        });

        return channelId;
    }
});