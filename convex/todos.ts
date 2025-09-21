import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Create a new todo
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todoId = await ctx.db.insert("todos", {
      ...args,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return todoId;
  },
});

// Get todos for the current user
export const getMyTodos = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    let query = ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.status && args.status !== "all") {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.priority && args.priority !== "all") {
      query = query.filter((q) => q.eq(q.field("priority"), args.priority));
    }

    const todos = await query.order("desc").collect();

    // Populate user information and counts
    const todosWithUsers = await Promise.all(
      todos.map(async (todo) => {
        const user = await ctx.db.get(todo.userId);

        // Get comment count
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_todo", (q) => q.eq("todoId", todo._id))
          .collect();

        // Get reaction count
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_todo", (q) => q.eq("todoId", todo._id))
          .collect();

        return {
          ...todo,
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
          },
          commentCount: comments.length,
          reactionCount: reactions.length,
        };
      })
    );

    return todosWithUsers;
  },
});

// Get all public todos
export const getPublicTodos = query({
  args: {
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    let query = ctx.db
      .query("todos")
      .withIndex("by_public", (q) => q.eq("isPublic", true));

    if (args.status && args.status !== "all") {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.priority && args.priority !== "all") {
      query = query.filter((q) => q.eq(q.field("priority"), args.priority));
    }

    const todos = await query.order("desc").collect();

    // Populate user information and counts
    const todosWithUsers = await Promise.all(
      todos.map(async (todo) => {
        const user = await ctx.db.get(todo.userId);

        // Get comment count
        const comments = await ctx.db
          .query("comments")
          .withIndex("by_todo", (q) => q.eq("todoId", todo._id))
          .collect();

        // Get reaction count
        const reactions = await ctx.db
          .query("reactions")
          .withIndex("by_todo", (q) => q.eq("todoId", todo._id))
          .collect();

        return {
          ...todo,
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
          },
          commentCount: comments.length,
          reactionCount: reactions.length,
        };
      })
    );

    return todosWithUsers;
  },
});

// Get a single todo by ID
export const get = query({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Check if user can access this todo
    if (!todo.isPublic && todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Populate user information
    const user = await ctx.db.get(todo.userId);

    return {
      ...todo,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
    };
  },
});

// Get a single todo by ID (legacy)
export const getById = query({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Check if user can access this todo
    if (!todo.isPublic && todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Populate user information
    const user = await ctx.db.get(todo.userId);

    return {
      ...todo,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
      },
    };
  },
});

// Update a todo
export const update = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("TODO"),
        v.literal("IN_PROGRESS"),
        v.literal("DONE"),
        v.literal("CANCELLED")
      )
    ),
    priority: v.optional(
      v.union(v.literal("LOW"), v.literal("MEDIUM"), v.literal("HIGH"))
    ),
    tags: v.optional(v.array(v.string())),
    dueDate: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const { id, ...updateData } = args;

    // Check if status is being changed
    const statusChanged =
      updateData.status && updateData.status !== todo.status;

    await ctx.db.patch(args.id, {
      ...updateData,
      updatedAt: Date.now(),
    });

    // Create notification for status change if it's a public task
    if (statusChanged && todo.isPublic) {
      await ctx.runMutation(api.notifications.create, {
        type: "TASK_STATUS_CHANGE",
        title: "Task status updated",
        message: `"${todo.title}" status changed to ${updateData.status?.replace("_", " ")}`,
        userId: todo.userId,
        actorId: userId,
        relatedId: args.id,
      });
    }

    return args.id;
  },
});

// Delete a todo
export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});
