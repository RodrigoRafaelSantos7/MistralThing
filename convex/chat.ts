import { Mistral } from "@mistralai/mistralai";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
/**
 * Generate a response for a given thread.
 *
 * @param threadId - The ID of the thread to generate a response for.
 * @param history - The history of the thread. (Including the system prompt and the user prompt)
 */
export const generateResponse = internalAction({
  args: {
    threadId: v.id("thread"),
    history: v.array(
      v.object({
        role: v.union(
          v.literal("user"),
          v.literal("assistant"),
          v.literal("system")
        ),
        content: v.string(),
      })
    ),
    modelId: v.string(),
  },
  handler: async (ctx, { threadId, history, modelId }) => {
    await ctx.runMutation(internal.threads.updateStatus, {
      threadId,
      status: "submitted",
    });

    const assistantMessageId = await ctx.runMutation(
      internal.messages.addEmptyMessage,
      {
        threadId,
        role: "assistant",
        content: "",
        isStreaming: true,
      }
    );

    try {
      const client = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY,
      });

      await ctx.runMutation(internal.threads.updateStatus, {
        threadId,
        status: "streaming",
      });

      const stream = await client.chat.stream({
        model: modelId,
        messages: history,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        if (chunk.data?.choices?.[0]?.delta?.content) {
          const content = chunk.data.choices?.[0]?.delta?.content;
          fullResponse += content;

          // Update the message with accumulated content
          await ctx.runMutation(internal.messages.updateMessageInternal, {
            messageId: assistantMessageId,
            content: fullResponse,
            isStreaming: true,
          });
        }
      }

      await ctx.runMutation(internal.messages.updateMessageInternal, {
        messageId: assistantMessageId,
        content: fullResponse,
        isStreaming: false,
      });

      await ctx.runMutation(internal.threads.updateStatus, {
        threadId,
        status: "ready",
      });
    } catch (error) {
      await ctx.runMutation(internal.messages.updateMessageInternal, {
        messageId: assistantMessageId,
        content:
          "An error occurred while generating the response. Please try again.",
        isStreaming: false,
      });

      await ctx.runMutation(internal.threads.updateStatus, {
        threadId,
        status: "error",
      });
      throw error;
    }
  },
});
