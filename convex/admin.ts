import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Admin authentication
export const verifyAdminPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    // Get admin settings
    const adminSettings = await ctx.db.query("adminSettings").first();

    if (!adminSettings) {
      throw new Error("Admin not configured");
    }

    // Simple password comparison (in production, use proper hashing)
    if (adminSettings.adminPassword !== args.password) {
      throw new Error("Invalid admin password");
    }

    // Create session token using a simple random string generator
    const sessionToken =
      Math.random().toString(36).substring(2) +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2);
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    // Store session
    await ctx.db.insert("adminSessions", {
      sessionToken,
      isActive: true,
      createdAt: now,
      expiresAt,
    });

    return { sessionToken, expiresAt };
  },
});

export const verifyAdminSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (!session || !session.isActive || session.expiresAt < Date.now()) {
      return false;
    }

    return true;
  },
});

export const logoutAdmin = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { isActive: false });
    }
  },
});

// Analytics queries
export const getAnalyticsOverview = query({
  handler: async (ctx) => {
    // Get total counts
    const totalUsers = await ctx.db
      .query("users")
      .collect()
      .then((users) => users.length);
    const totalTodos = await ctx.db
      .query("todos")
      .collect()
      .then((todos) => todos.length);
    const totalComments = await ctx.db
      .query("comments")
      .collect()
      .then((comments) => comments.length);
    const totalMessages = await ctx.db
      .query("messages")
      .collect()
      .then((messages) => messages.length);
    const totalConversations = await ctx.db
      .query("conversations")
      .collect()
      .then((convs) => convs.length);

    // Get todos by status
    const todosByStatus = await ctx.db
      .query("todos")
      .collect()
      .then((todos) => {
        const statusCounts = {
          TODO: 0,
          IN_PROGRESS: 0,
          DONE: 0,
          CANCELLED: 0,
        };
        todos.forEach((todo) => {
          statusCounts[todo.status]++;
        });
        return statusCounts;
      });

    // Get todos by priority
    const todosByPriority = await ctx.db
      .query("todos")
      .collect()
      .then((todos) => {
        const priorityCounts = {
          LOW: 0,
          MEDIUM: 0,
          HIGH: 0,
        };
        todos.forEach((todo) => {
          priorityCounts[todo.priority]++;
        });
        return priorityCounts;
      });

    // Get recent activity (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentUsers = await ctx.db
      .query("users")
      .filter((q) => q.gte(q.field("_creationTime"), sevenDaysAgo))
      .collect()
      .then((users) => users.length);

    const recentTodos = await ctx.db
      .query("todos")
      .filter((q) => q.gte(q.field("createdAt"), sevenDaysAgo))
      .collect()
      .then((todos) => todos.length);

    const recentComments = await ctx.db
      .query("comments")
      .filter((q) => q.gte(q.field("createdAt"), sevenDaysAgo))
      .collect()
      .then((comments) => comments.length);

    return {
      totalUsers,
      totalTodos,
      totalComments,
      totalMessages,
      totalConversations,
      todosByStatus,
      todosByPriority,
      recentUsers,
      recentTodos,
      recentComments,
    };
  },
});

export const getUserAnalytics = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    // Get user activity stats
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const userTodos = await ctx.db
          .query("todos")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        const userComments = await ctx.db
          .query("comments")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        const userMessages = await ctx.db
          .query("messages")
          .withIndex("by_sender", (q) => q.eq("senderId", user._id))
          .collect();

        return {
          ...user,
          todoCount: userTodos.length,
          commentCount: userComments.length,
          messageCount: userMessages.length,
          completedTodos: userTodos.filter((t) => t.status === "DONE").length,
          activeTodos: userTodos.filter((t) => t.status === "IN_PROGRESS")
            .length,
        };
      })
    );

    return usersWithStats.sort((a, b) => b.todoCount - a.todoCount);
  },
});

export const getTodoAnalytics = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    const comments = await ctx.db.query("comments").collect();
    const reactions = await ctx.db.query("reactions").collect();

    // Get todos with additional analytics
    const todosWithStats = await Promise.all(
      todos.map(async (todo) => {
        const todoComments = comments.filter((c) => c.todoId === todo._id);
        const todoReactions = reactions.filter((r) => r.todoId === todo._id);

        const creator = await ctx.db.get(todo.userId);

        return {
          ...todo,
          commentCount: todoComments.length,
          reactionCount: todoReactions.length,
          creatorName: creator?.name || "Unknown",
          creatorEmail: creator?.email || "Unknown",
        };
      })
    );

    return todosWithStats.sort((a, b) => b.commentCount - a.commentCount);
  },
});

export const getCommentAnalytics = query({
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").collect();

    const commentsWithStats = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.userId);
        const todo = await ctx.db.get(comment.todoId);

        return {
          ...comment,
          authorName: author?.name || "Unknown",
          authorEmail: author?.email || "Unknown",
          todoTitle: todo?.title || "Unknown",
        };
      })
    );

    return commentsWithStats.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getReactionAnalytics = query({
  handler: async (ctx) => {
    const reactions = await ctx.db.query("reactions").collect();

    // Group reactions by emoji
    const emojiStats: Record<string, number> = {};
    reactions.forEach((reaction) => {
      emojiStats[reaction.emoji] = (emojiStats[reaction.emoji] || 0) + 1;
    });

    // Get most popular emojis
    const popularEmojis = Object.entries(emojiStats)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Convert emoji keys to safe ASCII strings for serialization
    const safeEmojiStats = Object.entries(emojiStats).map(([emoji, count]) => ({
      emoji,
      count,
    }));

    return {
      totalReactions: reactions.length,
      uniqueEmojis: Object.keys(emojiStats).length,
      popularEmojis,
      emojiStats: safeEmojiStats,
    };
  },
});

export const getChatAnalytics = query({
  handler: async (ctx) => {
    const conversations = await ctx.db.query("conversations").collect();
    const messages = await ctx.db.query("messages").collect();

    const conversationsWithStats = await Promise.all(
      conversations.map(async (conv) => {
        const convMessages = messages.filter(
          (m) => m.conversationId === conv._id
        );
        const creator = await ctx.db.get(conv.createdBy);

        return {
          ...conv,
          messageCount: convMessages.length,
          creatorName: creator?.name || "Unknown",
          lastActivity: conv.lastMessageAt || conv.createdAt,
        };
      })
    );

    const totalMessages = messages.length;
    const activeConversations = conversations.filter(
      (c) =>
        c.lastMessageAt &&
        Date.now() - c.lastMessageAt < 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      totalConversations: conversations.length,
      totalMessages,
      activeConversations,
      conversationsWithStats: conversationsWithStats.sort(
        (a, b) => b.lastActivity - a.lastActivity
      ),
    };
  },
});

// Initialize admin settings (run once to set up admin password)
export const initializeAdminSettings = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    // Check if admin settings already exist
    const existing = await ctx.db.query("adminSettings").first();
    if (existing) {
      throw new Error("Admin settings already initialized");
    }

    await ctx.db.insert("adminSettings", {
      adminPassword: args.password,
      lastUpdated: Date.now(),
    });

    return { success: true };
  },
});
