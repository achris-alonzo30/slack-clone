import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("workspaces").collect();
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

        return await ctx.db.insert("workspaces", {
            name,
            userId,
            joinCode,
        })
    }
})