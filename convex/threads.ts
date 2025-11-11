import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { threadStatus } from "./schema";

/**
 * List the threads for a given user.
 *
 * @param ctx - The context object.
 * @returns The threads for the user.
 */
export const listThreadsByUserId = query({
  args: {},
  returns: v.array(
    v.object({
      thread: v.any(),
      messages: v.array(v.any()),
    })
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const threads = await ctx.db
      .query("thread")
      .withIndex("by_userId_updatedAt", (q) =>
        q.eq("userId", user._id as string)
      )
      .collect();

    const messagesByThread = await Promise.all(
      threads.map(async (thread) => {
        const messages = await ctx.db
          .query("message")
          .withIndex("by_threadId_updatedAt", (q) =>
            q.eq("threadId", thread._id)
          )
          .collect();
        return { threadId: thread._id, messages };
      })
    );

    // Map messages to their threads
    const messagesMap = new Map(
      messagesByThread.map(({ threadId, messages }) => [threadId, messages])
    );

    return threads.map((thread) => ({
      thread,
      messages: messagesMap.get(thread._id) ?? [],
    }));
  },
});

/**
 * Create a thread for a given user.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The thread.
 */
export const createThread = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const thread = await ctx.db.insert("thread", {
      userId: args.userId,
      status: "ready",
      updatedAt: Date.now(),
    });
    return thread;
  },
});

/**
 * Update a thread for a given user.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The thread.
 */
export const updateThread = mutation({
  args: {
    threadId: v.id("thread"),
    title: v.optional(v.string()),
    status: v.optional(threadStatus),
    streamId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found.",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to update this thread.",
        severity: "high",
      });
    }

    const { threadId, ...updateFields } = args;

    await ctx.db.patch(threadId, {
      ...updateFields,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Delete a thread and all of its messages.
 *
 * @param ctx - The context object.
 * @param args - The arguments for the mutation.
 * @returns The result of the mutation.
 */
export const deleteThread = mutation({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }
    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found.",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to delete this thread.",
        severity: "high",
      });
    }

    const messages = await ctx.db
      .query("message")
      .withIndex("by_threadId_updatedAt", (q) =>
        q.eq("threadId", args.threadId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.threadId);
  },
});

export const getThread = query({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(args.threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found.",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to get this thread.",
        severity: "high",
      });
    }

    const messages = await ctx.db
      .query("message")
      .withIndex("by_threadId_updatedAt", (q) =>
        q.eq("threadId", args.threadId)
      )
      .collect();

    return { thread, messages };
  },
});
