import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Get all users (for DM chat)
export const getAllUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const users = await ctx.db.query("users").collect();

    // Filter out current user and return only necessary info
    return users
      .filter((user) => user._id !== userId)
      .map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      }));
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
});

// Update user presence
export const updatePresence = mutation({
  args: {
    status: v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("offline")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingPresence = await ctx.db
      .query("userPresence")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        status: args.status,
        lastSeen: Date.now(),
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId,
        status: args.status,
        lastSeen: Date.now(),
      });
    }

    return true;
  },
});

// Get user presence
export const getPresence = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const presence = await ctx.db
      .query("userPresence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    return (
      presence || {
        userId: args.userId,
        status: "offline" as const,
        lastSeen: 0,
      }
    );
  },
});

// Update typing indicator
export const updateTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user is participant in this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      throw new Error("Unauthorized");
    }

    const existingTyping = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique();

    if (existingTyping) {
      await ctx.db.patch(existingTyping._id, {
        isTyping: args.isTyping,
        lastTypingAt: Date.now(),
      });
    } else if (args.isTyping) {
      await ctx.db.insert("typingIndicators", {
        conversationId: args.conversationId,
        userId,
        isTyping: true,
        lastTypingAt: Date.now(),
      });
    }

    return true;
  },
});

// Get typing indicators for a conversation
export const getTypingIndicators = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify user is participant in this conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      throw new Error("Unauthorized");
    }

    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.and(q.eq(q.field("isTyping"), true), q.neq(q.field("userId"), userId))
      )
      .collect();

    // Get user info for each typing indicator
    const typingWithUsers = await Promise.all(
      typingIndicators.map(async (indicator) => {
        const user = await ctx.db.get(indicator.userId);
        return {
          ...indicator,
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
          },
        };
      })
    );

    return typingWithUsers;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updateData: any = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.image !== undefined) {
      updateData.image = args.image;
    }

    await ctx.db.patch(userId, updateData);
    return true;
  },
});

// Get notification preferences
export const getNotificationPreferences = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const preferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return preferences;
  },
});

// Initialize notification preferences (mutation)
export const initializeNotificationPreferences = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if preferences already exist
    const existingPreferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existingPreferences) {
      return existingPreferences;
    }

    // Create default preferences
    const defaultPreferences = {
      userId,
      taskComments: true,
      taskStatusChanges: true,
      taskAssignments: true,
      taskDueReminders: true,
      commentReplies: true,
      reactions: true,
      directMessages: true,
      mentions: true,
      emailNotifications: true,
      pushNotifications: true,
      updatedAt: Date.now(),
    };

    const newPreferencesId = await ctx.db.insert(
      "notificationPreferences",
      defaultPreferences
    );
    return { ...defaultPreferences, _id: newPreferencesId };
  },
});

// Update notification preferences
export const updateNotificationPreferences = mutation({
  args: {
    taskComments: v.optional(v.boolean()),
    taskStatusChanges: v.optional(v.boolean()),
    taskAssignments: v.optional(v.boolean()),
    taskDueReminders: v.optional(v.boolean()),
    commentReplies: v.optional(v.boolean()),
    reactions: v.optional(v.boolean()),
    directMessages: v.optional(v.boolean()),
    mentions: v.optional(v.boolean()),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const preferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Only update provided fields
    Object.keys(args).forEach((key) => {
      if (args[key as keyof typeof args] !== undefined) {
        updateData[key] = args[key as keyof typeof args];
      }
    });

    if (preferences) {
      await ctx.db.patch(preferences._id, updateData);
    } else {
      // Create new preferences with defaults
      const newPreferences = {
        userId,
        taskComments: args.taskComments ?? true,
        taskStatusChanges: args.taskStatusChanges ?? true,
        taskAssignments: args.taskAssignments ?? true,
        taskDueReminders: args.taskDueReminders ?? true,
        commentReplies: args.commentReplies ?? true,
        reactions: args.reactions ?? true,
        directMessages: args.directMessages ?? true,
        mentions: args.mentions ?? true,
        emailNotifications: args.emailNotifications ?? true,
        pushNotifications: args.pushNotifications ?? true,
        updatedAt: Date.now(),
      };
      await ctx.db.insert("notificationPreferences", newPreferences);
    }

    return true;
  },
});
