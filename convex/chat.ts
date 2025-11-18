import { Mistral } from "@mistralai/mistralai";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { internalAction, mutation } from "./_generated/server";
import { authComponent } from "./auth";
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
  returns: v.null(),
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

const getSystemPrompt = (
  nickname?: string,
  biography?: string,
  instructions?: string
) => `Your name is Mistral Thing.
    The website you are on is https://mistral-thing.xyz
    You are a helpful assistant that can help with tasks.

    ${nickname ? `The user prefers to be called ${nickname}.` : ""}
    ${biography ? `The user's biography is ${biography}.` : ""}
    ${instructions}`;

export const sendMessage = mutation({
  args: {
    threadId: v.id("thread"),
    message: v.string(),
  },
  handler: async (ctx, { threadId, message }) => {
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
        message: "Thread not found.",
        severity: "high",
      });
    }

    if (thread.userId !== user._id) {
      throw new ConvexError({
        code: 403,
        message: "You are not allowed to send messages to this thread.",
        severity: "high",
      });
    }

    const messages = await ctx.runQuery(
      internal.messages.getMessagesForThread,
      {
        threadId,
      }
    );

    const history = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const settings = await ctx.runQuery(api.settings.get);

    if (history.length === 0) {
      const systemPrompt = getSystemPrompt(
        settings.nickname,
        settings.biography,
        settings.instructions
      );

      await ctx.runMutation(internal.messages.addMessage, {
        threadId,
        content: systemPrompt,
        role: "system",
        isStreaming: false,
      });

      history.push({
        role: "system",
        content: systemPrompt,
      });

      await ctx.scheduler.runAfter(0, internal.chat.generateTitle, {
        threadId,
        content: message,
      });
    }

    await ctx.runMutation(internal.messages.addMessage, {
      threadId,
      content: message,
      role: "user",
      isStreaming: false,
    });

    history.push({
      role: "user",
      content: message,
    });

    console.log(history);

    // Schedule the action to run asynchronously (mutations cannot call actions directly)
    await ctx.scheduler.runAfter(0, internal.chat.generateResponse, {
      threadId,
      history,
      modelId: settings.modelId,
    });
  },
});

const titlePrompt = `\nc
                - you will generate a short title based on the first message a user begins a conversation with
                - ensure it is not more than 80 characters long
                - the title should be a summary of the user's message
                - do not use quotes or colons
                - this is the user's first message, so it should be a summary of the user's message`;

export const generateTitle = internalAction({
  args: {
    threadId: v.id("thread"),
    content: v.string(),
  },
  handler: async (ctx, { threadId, content }) => {
    try {
      const client = new Mistral({
        apiKey: process.env.MISTRAL_API_KEY,
      });

      const result = await client.chat.complete({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: titlePrompt },
          { role: "user", content },
        ],
      });

      console.log(result);

      await ctx.runMutation(internal.threads.updateTitle, {
        threadId,
        title: result.choices[0].message.content as string,
      });
    } catch (error) {
      console.error(error);
      await ctx.runMutation(internal.threads.updateTitle, {
        threadId,
        title: "New Thread",
      });
      throw new ConvexError({
        code: 500,
        message: "An error occurred while generating the title.",
        severity: "high",
      });
    }
  },
});
