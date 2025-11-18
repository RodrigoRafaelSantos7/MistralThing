import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

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
