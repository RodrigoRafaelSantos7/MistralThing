import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

const siteUrl = process.env.SITE_URL as string;

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      onCreate: async (ctx, doc) => {
        await ctx.db.insert("settings", {
          userId: doc._id,
          mode: "dark",
          theme: "default",
          modelId: "mistral-small-latest",
          pinnedModels: ["magistral-small-latest", "mistral-small-latest"],
        });
      },
      onUpdate: async (ctx, newDoc, oldDoc) => {
        const settings = await ctx.db
          .query("settings")
          .withIndex("by_userId", (q) => q.eq("userId", oldDoc._id))
          .unique();

        if (settings) {
          await ctx.db.patch(settings._id, {
            userId: newDoc._id,
          });
        }
      },
      onDelete: async (ctx, doc) => {
        const settings = await ctx.db
          .query("settings")
          .withIndex("by_userId", (q) => q.eq("userId", doc._id))
          .unique();

        if (settings) {
          await ctx.db.delete(settings._id);
        }
      },
    },
  },
});
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) =>
  betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    trustedOrigins: [
      "https://mistral-thing.xyz",
      "https://www.mistral-thing.xyz",
      "http://localhost:3000",
    ],
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
    },
    plugins: [
      convex(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await requireActionCtx(ctx).runAction(internal.email.sendMagicLink, {
            to: email,
            url,
          });
        },
      }),
    ],
  });

/**
 * Lists the current authenticated user's sessions.
 *
 * @returns The current user's sessions or an empty array if not authenticated
 */
export const listSessions = query({
  handler: async (ctx) => {
    try {
      const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
      const sessions = await auth.api.listSessions({
        headers,
      });
      return sessions;
    } catch (error) {
      console.error("Error listing sessions:", error);
      return [];
    }
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
