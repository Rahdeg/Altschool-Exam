import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

// Type for notification with user information
type NotificationWithActor = Doc<"notifications"> & {
  actor: {
    _id: Id<"users"> | undefined;
    name: string | undefined;
    email: string | undefined;
    image: string | undefined;
  };
};

// Create a notification
export const create = mutation({
  args: {
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
    userId: v.id("users"),
    actorId: v.id("users"),
    relatedId: v.optional(
      v.union(v.id("todos"), v.id("comments"), v.id("messages"))
    ),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    // Don't create notification for self
    if (currentUserId === args.userId) {
      return null;
    }

    // For now, create all notifications (preferences will be added later)

    const notificationId = await ctx.db.insert("notifications", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });

    return notificationId;
  },
});

// Get notifications for the current user
export const getMyNotifications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const limit = args.limit || 50;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    // Populate actor information
    const notificationsWithActors = await Promise.all(
      notifications.map(async (notification) => {
        const actor = await ctx.db.get(notification.actorId);
        return {
          ...notification,
          actor: {
            _id: actor?._id,
            name: actor?.name,
            email: actor?.email,
            image: actor?.image,
          },
        };
      })
    );

    return notificationsWithActors;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return args.notificationId;
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});

// Delete notification
export const remove = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.notificationId);
    return args.notificationId;
  },
});

// Notification preferences will be added later

// Helper function to create notification for task comment
export const createTaskCommentNotification = mutation({
  args: {
    todoId: v.id("todos"),
    commentId: v.id("comments"),
    commenterId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.todoId);
    if (!todo) return null;

    const commenter = await ctx.db.get(args.commenterId);
    if (!commenter) return null;

    // Don't notify the task owner if they're the one commenting
    if (todo.userId === args.commenterId) return null;

    return await ctx.db.insert("notifications", {
      type: "TASK_COMMENT",
      title: "New comment on your task",
      message: `${commenter.name} commented on "${todo.title}"`,
      userId: todo.userId,
      actorId: args.commenterId,
      relatedId: args.todoId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Helper function to create notification for comment reply
export const createCommentReplyNotification = mutation({
  args: {
    parentCommentId: v.id("comments"),
    replyCommentId: v.id("comments"),
    replierId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const parentComment = await ctx.db.get(args.parentCommentId);
    if (!parentComment) return null;

    const replier = await ctx.db.get(args.replierId);
    if (!replier) return null;

    // Don't notify the comment author if they're replying to themselves
    if (parentComment.userId === args.replierId) return null;

    const todo = await ctx.db.get(parentComment.todoId);
    if (!todo) return null;

    return await ctx.db.insert("notifications", {
      type: "COMMENT_REPLY",
      title: "Reply to your comment",
      message: `${replier.name} replied to your comment on "${todo.title}"`,
      userId: parentComment.userId,
      actorId: args.replierId,
      relatedId: args.parentCommentId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Helper function to create notification for reaction
export const createReactionNotification = mutation({
  args: {
    todoId: v.optional(v.id("todos")),
    commentId: v.optional(v.id("comments")),
    reactorId: v.id("users"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const reactor = await ctx.db.get(args.reactorId);
    if (!reactor) return null;

    let targetUserId: Id<"users"> | null = null;
    let targetTitle = "";
    let relatedId: Id<"todos"> | Id<"comments"> | undefined;

    if (args.todoId) {
      const todo = await ctx.db.get(args.todoId);
      if (!todo) return null;
      targetUserId = todo.userId;
      targetTitle = todo.title;
      relatedId = args.todoId;
    } else if (args.commentId) {
      const comment = await ctx.db.get(args.commentId);
      if (!comment) return null;
      targetUserId = comment.userId;
      const todo = await ctx.db.get(comment.todoId);
      targetTitle = todo?.title || "a comment";
      relatedId = args.commentId;
    }

    if (!targetUserId) return null;

    // Don't notify the target user if they're the one reacting
    if (targetUserId === args.reactorId) return null;

    return await ctx.db.insert("notifications", {
      type: "REACTION_ADDED",
      title: "New reaction",
      message: `${reactor.name} reacted with ${args.emoji} to "${targetTitle}"`,
      userId: targetUserId,
      actorId: args.reactorId,
      relatedId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

// Helper function to create notification for new message
export const createMessageNotification = mutation({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    senderId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const sender = await ctx.db.get(args.senderId);
    if (!sender) return null;

    // Notify all participants except the sender
    const recipients = conversation.participants.filter(
      (id) => id !== args.senderId
    );

    const notifications = await Promise.all(
      recipients.map((recipientId) =>
        ctx.db.insert("notifications", {
          type: "NEW_MESSAGE",
          title: "New message",
          message: `${sender.name} sent you a message`,
          userId: recipientId,
          actorId: args.senderId,
          relatedId: args.messageId,
          isRead: false,
          createdAt: Date.now(),
        })
      )
    );

    return notifications.filter(Boolean);
  },
});
