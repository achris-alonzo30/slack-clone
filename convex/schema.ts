import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { update } from "./channels";

const schema = defineSchema({
  ...authTables,

  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_and_user_id", ["workspaceId", "userId"]),

  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),

  conversations: defineTable({
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    updatedAt: v.number(),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    image: v.optional(v.id("_storage")),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  })
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_parent_message_id_conversation_id", 
      [
        "channelId", 
        "parentMessageId", 
        "conversationId"
      ]),

  reactions: defineTable({
    value: v.string(),
    memberId: v.id("members"),
    messageId: v.id("messages"),
    workspaceId: v.id("workspaces"),
  })
    .index("by_member_id", ["memberId"])
    .index("by_message_id", ["messageId"])
    .index("by_workspace_id", ["workspaceId"]),
});
 
export default schema;