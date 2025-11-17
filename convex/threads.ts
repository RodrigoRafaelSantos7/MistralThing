import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Retrieves a thread by its ID or slug.
 *
 * @param args.threadId - The ID of the thread
 *
 * @returns The thread
 *
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 403 if user is not authorized to access the thread
 * @throws {ConvexError} 404 if thread not found
 */
export const getThreadById = query({
  args: {
    threadId: v.id("thread"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found. ",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    return thread;
  },
});

/**
 * Retrieves a thread by its slug.
 *
 * @param args.slug - The slug of the thread
 *
 * @returns The thread
 *
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 403 if user is not authorized to access the thread
 * @throws {ConvexError} 404 if thread not found
 */
export const getThreadBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db
      .query("thread")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found. ",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    return thread;
  },
});

/**
 * Retrieves all threads for a user.
 *
 * @returns All threads for the user
 *
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const getAllThreadsForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const threads = await ctx.db
      .query("thread")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return threads;
  },
});

/**
 * Updates a thread.
 *
 * @param args.threadId - The ID of the thread
 * @param args.title - The title of the thread
 *
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 403 if user is not authorized to update the thread
 * @throws {ConvexError} 404 if thread not found
 *
 * @returns The updated thread
 */
export const update = mutation({
  args: {
    threadId: v.id("thread"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, title }) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found. ",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    await ctx.db.patch(threadId, {
      title,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Removes a thread.
 *
 * @param args.threadId - The ID of the thread
 *
 * @throws {ConvexError} 401 if user not found/not authenticated
 * @throws {ConvexError} 403 if user is not authorized to remove the thread
 * @throws {ConvexError} 404 if thread not found
 */
export const remove = mutation({
  args: {
    threadId: v.id("thread"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const thread = await ctx.db.get(threadId);

    if (!thread) {
      throw new ConvexError({
        code: 404,
        message: "Thread not found. ",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not authorized to access this thread.",
        severity: "high",
      });
    }

    await ctx.db.delete(threadId);
  },
});

/**
 * Updates the updatedAt timestamp of a thread.
 *
 * @param args.threadId - The ID of the thread
 */
export const bump = internalMutation({
  args: {
    threadId: v.id("thread"),
  },
  handler: async (ctx, { threadId }) => {
    await ctx.db.patch(threadId, {
      updatedAt: Date.now(),
    });
  },
});
