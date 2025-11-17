import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  settings: defineTable({
    userId: v.string(),
    theme: v.union(
      v.literal("default"),
      v.literal("t3-chat"),
      v.literal("claymorphism"),
      v.literal("claude"),
      v.literal("graphite"),
      v.literal("amethyst-haze"),
      v.literal("vercel")
    ),
    mode: v.union(v.literal("light"), v.literal("dark")),
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
    modelId: v.string(), // The current model selected by the user
    pinnedModels: v.array(v.string()), // The models pinned by the user
  }).index("by_userId", ["userId"]),

  model: defineTable({
    modelId: v.string(), // Mistrals Model ID
    name: v.string(),
    description: v.string(),
    capabilities: v.object({
      completionChat: v.optional(v.boolean()),
      completionFim: v.optional(v.boolean()),
      functionCalling: v.optional(v.boolean()),
      fineTuning: v.optional(v.boolean()),
      vision: v.optional(v.boolean()),
      classification: v.optional(v.boolean()),
    }),
  }).index("by_modelId", ["modelId"]),

  thread: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    slug: v.string(), // Used to identify the thread in the URL
    updatedAt: v.number(),
    status: v.union(
      v.literal("ready"),
      v.literal("streaming"),
      v.literal("submitted"),
      v.literal("error")
    ),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"]),

  message: defineTable({
    threadId: v.id("thread"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
    isStreaming: v.optional(v.boolean()),
  }).index("by_thread", ["threadId"]),
});
