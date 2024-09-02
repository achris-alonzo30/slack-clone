import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
    return Array.from(
        { length: 6 },
        () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
    ).join("");
}

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
});

export const getInfoById = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) return null;
        
        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();
        
        const workspace = await ctx.db.get(workspaceId);

        return {
            name: workspace?.name,
            isMember: !!member
        }
    }
})

export const getById = query({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member) return null;

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

        const joinCode = generateCode();

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

        await ctx.db.insert("channels", {
            name: "Untitled",
            workspaceId,
        });

        return workspaceId;
    }
})

export const update = mutation({
    args: {
        name: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId, name }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin" ) {
            throw new Error("Unauthorized")
        };

        await ctx.db.patch(workspaceId, { name });

        return workspaceId;
    }
})

export const remove = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (userId === null) {
            throw new Error("Client is not authenticated!")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin" ) {
            throw new Error("Unauthorized")
        };

        const [members] = await Promise.all([
            ctx.db.query("members").withIndex("by_workspace_id", q => q.eq("workspaceId", workspaceId)).collect(),
        ]);

        for (const member of members) {
            await ctx.db.delete(member._id)
        }

        await ctx.db.delete(workspaceId);

        return workspaceId;
    }
});

export const newJoinCode = mutation({
    args: { workspaceId: v.id("workspaces") },
    handler: async (ctx, { workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Client is not authenticated!")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized")
        }

        const joinCode = generateCode();

        await ctx.db.patch(workspaceId, { joinCode });

        return workspaceId;
    }
});

export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, { joinCode, workspaceId }) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) {
            throw new Error("Client is not authenticated!")
        }

        const workspace = await ctx.db.get(workspaceId);

        if (!workspace) {
            throw new Error("Workspace not found")
        }

        if (workspace.joinCode !== joinCode.toLowerCase()) {
            throw new Error("Invalid join code")
        }

        const existingMember = await ctx.db
            .query("members")
            .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
            .unique();

        if (existingMember) {
            throw new Error("Already a member of this workspace")
        }

        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "member",
        });

        return workspaceId;
    }
})