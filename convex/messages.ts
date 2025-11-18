import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/**
 * Add a new empty message to a thread.
 *
 * @param threadId - The ID of the thread to add the message to.
 * @param role - The role of the message.
 * @param content - The content of the message.
 */
export const addEmptyMessage = internalMutation({
  args: {
    threadId: v.id("thread"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
    isStreaming: v.boolean(),
  },
  handler: async (ctx, { threadId, role, content, isStreaming }) =>
    await ctx.db.insert("message", {
      threadId,
      role,
      content,
      isStreaming,
    }),
});

/**
 * Updates a message in the database.
 */
export const updateMessageInternal = internalMutation({
  args: {
    messageId: v.id("message"),
    content: v.string(),
    isStreaming: v.boolean(),
  },
  handler: async (ctx, { messageId, content, isStreaming }) => {
    await ctx.db.patch(messageId, {
      content,
      isStreaming,
    });
  },
});

/**
 * Add a new message to a thread.
 *
 * @param threadId - The ID of the thread to add the message to.
 * @param content - The content of the message.
 * @param role - The role of the message.
 * @param isStreaming - Whether the message is streaming.
 */
export const addMessage = internalMutation({
  args: {
    threadId: v.id("thread"),
    content: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    isStreaming: v.boolean(),
  },
  handler: async (ctx, { threadId, content, role, isStreaming }) =>
    await ctx.db.insert("message", {
      threadId,
      role,
      content,
      isStreaming,
    }),
});

/**
 * Get the messages for a thread.
 *
 * @param threadId - The ID of the thread to get the messages for.
 * @returns The messages for the thread.
 */
export const getMessagesForThread = internalQuery({
  args: {
    threadId: v.id("thread"),
  },
  handler: async (ctx, { threadId }) =>
    await ctx.db
      .query("message")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .order("asc")
      .collect(),
});
