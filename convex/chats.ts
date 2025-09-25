import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Create or get existing conversation between two users
export const createOrGetConversation = mutation({
  args: {
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (userId === args.otherUserId) {
      throw new Error("Cannot create conversation with yourself");
    }

    // Check if conversation already exists
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("type"), "dm"))
      .collect()
      .then((conversations) =>
        conversations.find(
          (conv) =>
            conv.participants.includes(userId) &&
            conv.participants.includes(args.otherUserId)
        )
      );

    if (existingConversation) {
      return existingConversation._id;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      type: "dm",
      participants: [userId, args.otherUserId],
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

// Get conversations for the current user
export const getConversations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const allConversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("type"), "dm"))
      .collect()
      .then((conversations) =>
        conversations.filter((conv) => conv.participants.includes(userId))
      );

    // Get the latest message and unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      allConversations.map(async (conversation) => {
        const otherUserId = conversation.participants.find(
          (id: Id<"users">) => id !== userId
        );
        const otherUser = otherUserId ? await ctx.db.get(otherUserId) : null;

        // Get latest message
        const latestMessage = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .order("desc")
          .first();

        // Get unread count
        const unreadCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) =>
            q.eq("conversationId", conversation._id)
          )
          .filter((q) => q.neq(q.field("senderId"), userId))
          .collect()
          .then((messages) => {
            return Promise.all(
              messages.map(async (message) => {
                const read = await ctx.db
                  .query("messageReads")
                  .withIndex("by_message", (q) =>
                    q.eq("messageId", message._id)
                  )
                  .filter((q) => q.eq(q.field("userId"), userId))
                  .unique();
                return !read;
              })
            );
          })
          .then((reads) => reads.filter(Boolean).length);

        return {
          ...conversation,
          otherUser: {
            _id: otherUser?._id,
            name: otherUser?.name,
            email: otherUser?.email,
            image: otherUser?.image,
          },
          latestMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    return conversationsWithDetails.sort((a, b) => {
      const aTime = a.latestMessage?.createdAt || a._creationTime;
      const bTime = b.latestMessage?.createdAt || b._creationTime;
      return bTime - aTime;
    });
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
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

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect();

    // Get sender information for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message: Doc<"messages">) => {
        const sender = await ctx.db.get(message.senderId);
        const replyToMessage = message.replyToMessageId
          ? await ctx.db.get(message.replyToMessageId)
          : null;

        // Type guard to check if sender is a user
        const isUser = (
          doc: Doc<"users"> | Doc<"todos"> | null
        ): doc is Doc<"users"> => {
          return doc !== null && doc._id && "name" in doc;
        };

        return {
          ...message,
          sender: isUser(sender)
            ? {
                _id: sender._id,
                name: sender.name,
                email: sender.email,
                image: sender.image,
              }
            : null,
          replyToMessage,
        };
      })
    );

    return messagesWithSenders.reverse(); // Return in chronological order
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    body: v.string(),
    type: v.optional(
      v.union(v.literal("text"), v.literal("image"), v.literal("file"))
    ),
    replyToMessageId: v.optional(v.id("messages")),
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

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      type: args.type || "text",
      conversationId: args.conversationId,
      senderId: userId,
      replyToMessageId: args.replyToMessageId,
      createdAt: Date.now(),
    });

    // Update conversation's last message time
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notification for new message
    await ctx.runMutation(api.notifications.createMessageNotification, {
      conversationId: args.conversationId,
      messageId,
      senderId: userId,
    });

    return messageId;
  },
});

// Mark messages as read
export const markAsRead = mutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Mark each message as read
    for (const messageId of args.messageIds) {
      const message = await ctx.db.get(messageId);
      if (!message) continue;

      // Verify user is participant in the conversation
      const conversation = await ctx.db.get(message.conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        continue;
      }

      // Check if already read
      const existingRead = await ctx.db
        .query("messageReads")
        .withIndex("by_message", (q) => q.eq("messageId", messageId))
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();

      if (!existingRead) {
        await ctx.db.insert("messageReads", {
          messageId,
          userId,
          readAt: Date.now(),
        });
      }
    }

    return true;
  },
});

// Toggle star status for a message
export const toggleMessageStar = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Verify user is participant in the conversation
    const conversation = await ctx.db.get(message.conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      throw new Error("Unauthorized");
    }

    // Toggle star status
    await ctx.db.patch(args.messageId, {
      isStarred: !message.isStarred,
    });

    return !message.isStarred;
  },
});

// Clear all messages in a conversation (soft delete)
export const clearConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
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

    // Get all messages in the conversation
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Soft delete all messages
    const deletePromises = messages.map((message) =>
      ctx.db.patch(message._id, {
        deletedAt: Date.now(),
      })
    );

    await Promise.all(deletePromises);

    return true;
  },
});
