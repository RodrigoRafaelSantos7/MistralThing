import { ConvexError } from "convex/values";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const listThreadsByUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    const threads = await ctx.runQuery(
      components.agent.threads.listThreadsByUserId,
      { userId: user._id as string }
    );
    return threads;
  },
});
