import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Type for reaction with user information
type ReactionWithUser = Doc<"reactions"> & {
  user: {
    _id: Id<"users"> | undefined;
    name: string | undefined;
    email: string | undefined;
    image: string | undefined;
  };
};

// Add or remove a reaction
export const toggle = mutation({
  args: {
    emoji: v.string(),
    todoId: v.optional(v.id("todos")),
    commentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Validate that either todoId or commentId is provided, but not both
    if (!args.todoId && !args.commentId) {
      throw new Error("Either todoId or commentId must be provided");
    }

    if (args.todoId && args.commentId) {
      throw new Error("Cannot react to both todo and comment simultaneously");
    }

    // Check if user already reacted with this emoji
    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => {
        let condition = q.eq(q.field("emoji"), args.emoji);
        if (args.todoId) {
          condition = q.and(condition, q.eq(q.field("todoId"), args.todoId));
        }
        if (args.commentId) {
          condition = q.and(
            condition,
            q.eq(q.field("commentId"), args.commentId)
          );
        }
        return condition;
      })
      .unique();

    if (existingReaction) {
      // Remove the reaction
      await ctx.db.delete(existingReaction._id);
      return { action: "removed", reactionId: existingReaction._id };
    } else {
      // Add the reaction
      const reactionId = await ctx.db.insert("reactions", {
        emoji: args.emoji,
        todoId: args.todoId,
        commentId: args.commentId,
        userId,
        createdAt: Date.now(),
      });

      // Create notification for reaction
      await ctx.runMutation(api.notifications.createReactionNotification, {
        todoId: args.todoId,
        commentId: args.commentId,
        reactorId: userId,
        emoji: args.emoji,
      });

      return { action: "added", reactionId };
    }
  },
});

// Get reactions for a todo
export const getByTodo = query({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_todo", (q) => q.eq("todoId", args.todoId))
      .collect();

    // Group reactions by emoji and get user info
    const reactionGroups = new Map<string, ReactionWithUser[]>();

    for (const reaction of reactions) {
      const user = await ctx.db.get(reaction.userId);
      const userInfo = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      };

      if (!reactionGroups.has(reaction.emoji)) {
        reactionGroups.set(reaction.emoji, []);
      }
      reactionGroups.get(reaction.emoji)!.push({
        ...reaction,
        user: userInfo,
      });
    }

    return Array.from(reactionGroups.entries()).map(([emoji, users]) => ({
      emoji,
      count: users.length,
      users,
    }));
  },
});

// Get reactions for a comment
export const getByComment = query({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_comment", (q) => q.eq("commentId", args.commentId))
      .collect();

    // Group reactions by emoji and get user info
    const reactionGroups = new Map<string, ReactionWithUser[]>();

    for (const reaction of reactions) {
      const user = await ctx.db.get(reaction.userId);
      const userInfo = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      };

      if (!reactionGroups.has(reaction.emoji)) {
        reactionGroups.set(reaction.emoji, []);
      }
      reactionGroups.get(reaction.emoji)!.push({
        ...reaction,
        user: userInfo,
      });
    }

    return Array.from(reactionGroups.entries()).map(([emoji, users]) => ({
      emoji,
      count: users.length,
      users,
    }));
  },
});
