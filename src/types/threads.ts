import type { Id } from "@/convex/_generated/dataModel";

export type Status = "ready" | "streaming" | "submitted";

export type Thread = {
  _id: Id<"thread">;
  _creationTime: number;
  title?: string;
  status: Status;
  streamId?: string;
  updatedAt: number;
  userId: string;
};
