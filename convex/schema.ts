import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Todos table
  todos: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("TODO"),
      v.literal("IN_PROGRESS"),
      v.literal("DONE"),
      v.literal("CANCELLED")
    ),
    priority: v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH")),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    isPublic: v.boolean(),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_public", ["isPublic"])
    .index("by_user_status", ["userId", "status"])
    .index("by_created_at", ["createdAt"]),

  // Comments table
  comments: defineTable({
    body: v.string(),
    todoId: v.id("todos"),
    userId: v.id("users"),
    parentCommentId: v.optional(v.id("comments")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_todo", ["todoId"])
    .index("by_user", ["userId"])
    .index("by_parent_comment", ["parentCommentId"])
    .index("by_todo_created", ["todoId", "createdAt"]),

  // Reactions table
  reactions: defineTable({
    emoji: v.string(),
    todoId: v.optional(v.id("todos")),
    commentId: v.optional(v.id("comments")),
    messageId: v.optional(v.id("messages")),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_todo", ["todoId"])
    .index("by_comment", ["commentId"])
    .index("by_message", ["messageId"])
    .index("by_user", ["userId"])
    .index("by_todo_emoji", ["todoId", "emoji"])
    .index("by_comment_emoji", ["commentId", "emoji"])
    .index("by_message_emoji", ["messageId", "emoji"]),

  // Conversations table for DM chat
  conversations: defineTable({
    type: v.union(v.literal("dm"), v.literal("group")),
    participants: v.array(v.id("users")),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.optional(v.number()),
  })
    .index("by_participant", ["participants"])
    .index("by_created_by", ["createdBy"])
    .index("by_last_message", ["lastMessageAt"]),

  // Messages table for DM chat
  messages: defineTable({
    body: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file")),
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    replyToMessageId: v.optional(v.id("messages")),
    editedAt: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    isStarred: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_sender", ["senderId"])
    .index("by_conversation_created", ["conversationId", "createdAt"])
    .index("by_reply_to", ["replyToMessageId"]),

  // Message reads table
  messageReads: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    readAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_user", ["userId"])
    .index("by_message_user", ["messageId", "userId"]),

  // User presence table
  userPresence: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("offline")
    ),
    lastSeen: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  // Typing indicators table
  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
    lastTypingAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_user", ["userId"])
    .index("by_conversation_user", ["conversationId", "userId"]),

  // Notifications table
  notifications: defineTable({
    type: v.union(
      v.literal("TASK_COMMENT"),
      v.literal("TASK_STATUS_CHANGE"),
      v.literal("TASK_ASSIGNED"),
      v.literal("TASK_DUE_SOON"),
      v.literal("COMMENT_REPLY"),
      v.literal("REACTION_ADDED"),
      v.literal("NEW_MESSAGE"),
      v.literal("TASK_MENTION")
    ),
    title: v.string(),
    message: v.string(),
    userId: v.id("users"), // recipient
    actorId: v.id("users"), // who triggered the notification
    relatedId: v.optional(
      v.union(v.id("todos"), v.id("comments"), v.id("messages"))
    ),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"])
    .index("by_type", ["type"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),

  // Notification preferences table
  notificationPreferences: defineTable({
    userId: v.id("users"),
    taskComments: v.boolean(),
    taskStatusChanges: v.boolean(),
    taskAssignments: v.boolean(),
    taskDueReminders: v.boolean(),
    commentReplies: v.boolean(),
    reactions: v.boolean(),
    directMessages: v.boolean(),
    mentions: v.boolean(),
    emailNotifications: v.boolean(),
    pushNotifications: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Admin settings table
  adminSettings: defineTable({
    adminPassword: v.string(),
    lastUpdated: v.number(),
  }),

  // Admin sessions table
  adminSessions: defineTable({
    sessionToken: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_session", ["sessionToken"])
    .index("by_active", ["isActive"]),
});

export default schema;
