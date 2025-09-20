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
