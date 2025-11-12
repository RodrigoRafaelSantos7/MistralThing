import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const themes = v.union(
  v.literal("default"),
  v.literal("t3-chat"),
  v.literal("claymorphism"),
  v.literal("claude"),
  v.literal("graphite"),
  v.literal("amethyst-haze"),
  v.literal("vercel")
);

export const modes = v.union(v.literal("light"), v.literal("dark"));

export default defineSchema({
  settings: defineTable({
    userId: v.string(),
    mode: modes,
    theme: themes,
    nickname: v.optional(v.string()),
    biography: v.optional(v.string()),
    instructions: v.optional(v.string()),
    modelId: v.string(), // The current model selected by the user
    pinnedModels: v.array(v.string()), // The models pinned by the user
  }).index("by_userId", ["userId"]),
});
