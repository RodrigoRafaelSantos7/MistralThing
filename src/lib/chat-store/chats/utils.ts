import type { Id } from "@/convex/_generated/dataModel";

export type Chat = {
  id: Id<"chat">;
  model: string;
  title: string;
  userId: string;
  updatedAt: number;
  createdAt: number;
};
