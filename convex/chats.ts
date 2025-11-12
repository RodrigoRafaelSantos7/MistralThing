import { ConvexError, v } from "convex/values";
import { mutation, query } from "@/convex/_generated/server";
import { authComponent } from "@/convex/auth";

export const getAll = query({
  returns: v.union(
    v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        model: v.string(),
        userId: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
      })
    ),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return null;
    }

    const chats = await ctx.db
      .query("chat")
      .withIndex("by_userId_updatedAt", (q) =>
        q.eq("userId", user._id as string)
      )
      .order("desc")
      .collect();

    return chats.map((chat) => ({
      id: chat._id,
      title: chat.title,
      model: chat.model,
      userId: chat.userId,
      createdAt: chat._creationTime,
      updatedAt: chat.updatedAt,
    }));
  },
});

export const getOne = query({
  args: {
    id: v.id("chat"),
  },
  returns: v.union(
    v.object({
      id: v.string(),
      title: v.string(),
      model: v.string(),
      userId: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      return null;
    }

    const chat = await ctx.db.get(args.id);

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Chat not found.",
        severity: "high",
      });
    }

    return {
      id: chat._id,
      title: chat.title,
      model: chat.model,
      userId: chat.userId,
      createdAt: chat._creationTime,
      updatedAt: chat.updatedAt,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    model: v.string(),
  },
  returns: v.id("chat"),
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const now = Date.now();

    return await ctx.db.insert("chat", {
      title: args.title,
      model: args.model,
      userId: user._id as string,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("chat"),
    title: v.optional(v.string()),
    model: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const chat = await ctx.db.get(args.id);

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Chat not found.",
        severity: "high",
      });
    }

    if (chat.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not allowed to update this chat.",
        severity: "high",
      });
    }

    return await ctx.db.patch(chat._id, args);
  },
});

export const remove = mutation({
  args: {
    id: v.id("chat"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const chat = await ctx.db.get(args.id);

    if (!chat) {
      throw new ConvexError({
        code: 404,
        message: "Chat not found.",
        severity: "high",
      });
    }

    if (chat.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not allowed to delete this chat.",
        severity: "high",
      });
    }

    return await ctx.db.delete(chat._id);
  },
});
