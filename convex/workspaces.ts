import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) return [];

        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect();

        const workspaceIds = members.map((member) => member.workspaceId);

        const workspaces = [];

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId);

            if (workspace) workspaces.push(workspace);
        }

        return workspaces;
    }
})

export const getById = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        return await ctx.db.get(workspaceId);
    }
})

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, { name }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const joinCode = crypto.randomUUID();

        const workspaceId = await ctx.db.insert("workspaces", {
            name,
            userId,
            joinCode,
        });

        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin",
        });

        return workspaceId;
    }
})