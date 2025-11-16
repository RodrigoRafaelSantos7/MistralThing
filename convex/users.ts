import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const get = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx).catch(() => null);

    if (!user) {
      throw new ConvexError({
        code: 401,
        message: "User not found. Please login to continue.",
        severity: "high",
      });
    }

    return user;
  },
});
