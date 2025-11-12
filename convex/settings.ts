import { ConvexError } from "convex/values";
import { authComponent } from "@/convex/auth";
import { query } from "./_generated/server";

/**
 * Retrieves the user's settings with authorization checks.
 *
 * @returns The user's settings
 * @throws {ConvexError} 401 if user not found/not authenticated
 */
export const get = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "Unauthorized. You must be logged in to view your settings.",
        severity: "high",
      });
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", user._id as string))
      .unique();

    if (!settings) {
      throw new ConvexError({
        code: 404,
        message: "Settings not found. (This should never happen.)",
        severity: "high",
      });
    }

    return settings;
  },
});
