import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Type for comment with user information
type CommentWithUser = Doc<"comments"> & {
  user: {
    _id: Id<"users"> | undefined;
    name: string | undefined;
    email: string | undefined;
    image: string | undefined;
  };
};

// Type for comment with replies (tree structure)
type CommentWithReplies = CommentWithUser & {
  replies: CommentWithReplies[];
};

// Create a comment
export const create = mutation({
  args: {
    body: v.string(),
    todoId: v.id("todos"),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify the todo exists and user can access it
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (!todo.isPublic && todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const commentId = await ctx.db.insert("comments", {
      ...args,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notification for task comment
    if (!args.parentCommentId) {
      // This is a top-level comment on a task
      await ctx.runMutation(api.notifications.createTaskCommentNotification, {
        todoId: args.todoId,
        commentId,
        commenterId: userId,
      });
    } else {
      // This is a reply to a comment
      await ctx.runMutation(api.notifications.createCommentReplyNotification, {
        parentCommentId: args.parentCommentId,
        replyCommentId: commentId,
        replierId: userId,
      });
    }

    return commentId;
  },
});

// Get comments for a todo
export const getByTodo = query({
  args: { todoId: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Verify the todo exists and user can access it
    const todo = await ctx.db.get(args.todoId);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (!todo.isPublic && todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_todo", (q) => q.eq("todoId", args.todoId))
      .order("asc")
      .collect();

    // Populate user information and organize as tree
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
          },
        };
      })
    );

    // Organize comments into a tree structure
    const commentMap = new Map<string, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    commentsWithUsers.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    commentsWithUsers.forEach((comment: CommentWithUser) => {
      const commentWithReplies = commentMap.get(comment._id);
      if (!commentWithReplies) return;

      if (comment.parentCommentId) {
        const parent = commentMap.get(comment.parentCommentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  },
});

// Update a comment
export const update = mutation({
  args: {
    id: v.id("comments"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Only the comment author or todo owner can edit
    const todo = await ctx.db.get(comment.todoId);
    if (comment.userId !== userId && todo?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

// Delete a comment
export const remove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Only the comment author or todo owner can delete
    const todo = await ctx.db.get(comment.todoId);
    if (comment.userId !== userId && todo?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
