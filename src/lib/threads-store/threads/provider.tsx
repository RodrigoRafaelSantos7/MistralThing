"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { loginPath } from "@/lib/paths";

/**
 * The type of a thread defined in the database schema.
 */
export type Thread = Doc<"thread">;

/**
 * The context type for the threads provider.
 */
type ThreadsContextType = {
  /**
   * The threads for the current user.
   */
  threads: Thread[];
  /**
   * The function to update a thread.
   */
  updateThread: (props: UpdateThreadProps) => Promise<void>;
  /**
   * The function to remove a thread.
   */
  removeThread: (props: RemoveThreadProps) => Promise<void>;
};

/**
 * The context for the threads provider.
 */
const ThreadsContext = createContext<ThreadsContextType | undefined>(undefined);

type UpdateThreadProps = {
  /**
   * The ID of the thread to update.
   */
  threadId: Id<"thread">;
  /**
   * The title of the thread to update.
   */
  title?: string;
};

type RemoveThreadProps = {
  /**
   * The ID of the thread to remove.
   */
  threadId: Id<"thread">;
};

/**
 * The provider for the threads context.
 *
 * @param initialThreads - The initial threads for the current user.
 * @param children - The children to render.
 * @returns The threads provider.
 */
export function ThreadsProvider({
  initialThreads,
  children,
}: {
  children: React.ReactNode;
  initialThreads: Preloaded<typeof api.threads.getAllThreadsForUser>;
}) {
  const router = useRouter();

  const threads = usePreloadedQuery(initialThreads);

  const updateThreadMutation = useMutation(
    api.threads.update
  ).withOptimisticUpdate((localStore, args) => {
    const { threadId, title } = args;
    const currentThreads = localStore.getQuery(
      api.threads.getAllThreadsForUser
    );

    // If the threads query is loaded, update it optimistically
    if (currentThreads !== undefined) {
      // Map through all threads and update the matching thread with the new title
      // and current timestamp, leaving other threads unchanged
      const updatedThreads = currentThreads.map((thread) =>
        thread._id === threadId
          ? { ...thread, title, updatedAt: Date.now() }
          : thread
      );

      // Update the local store with the optimistically updated threads
      localStore.setQuery(api.threads.getAllThreadsForUser, {}, updatedThreads);
    }
  });

  const removeThreadMutation = useMutation(
    api.threads.remove
  ).withOptimisticUpdate((localStore, args) => {
    const { threadId } = args;
    const currentThreads = localStore.getQuery(
      api.threads.getAllThreadsForUser
    );

    // If the threads query is loaded, remove the thread optimistically
    if (currentThreads !== undefined) {
      // Filter out the thread to be removed
      const updatedThreads = currentThreads.filter(
        (thread) => thread._id !== threadId
      );

      // Update the local store with the optimistically updated threads
      localStore.setQuery(api.threads.getAllThreadsForUser, {}, updatedThreads);
    }
  });

  /**
   * Handles errors that occur when updating a thread.
   *
   * @param error - The error that occurred during the update operation
   *
   * @throws {Error} If the error is not a ConvexError, it is re-thrown
   * @throws {ConvexError} If the error code is not handled (default case)
   *
   * Error codes handled:
   * - 401: Redirects to login page (user not authenticated)
   * - 403: Shows error toast (user not authorized)
   * - 404: Redirects to not found page (thread not found)
   * - default: Shows generic error toast and re-throws the error
   */
  const handleUpdateThreadError = (error: unknown) => {
    if (!(error instanceof ConvexError)) {
      throw error;
    }

    const code =
      typeof (error.data as { code?: unknown })?.code === "number"
        ? (error.data as { code: number }).code
        : undefined;

    switch (code) {
      case 401:
        router.push(loginPath());
        return;
      case 403:
        toast.error("You are not authorized to update this thread.");
        return;
      case 404:
        toast.error("Thread not found.");
        router.push("/404");
        return;
      default:
        toast.error("Failed to update the thread. Please try again.");
        throw error;
    }
  };

  /**
   * Updates a thread.
   *
   * @param props.threadId - The ID of the thread
   * @param props.title - The title of the thread
   *
   * @redirects to login page if user is not authenticated
   */
  const updateThread = async ({ threadId, title }: UpdateThreadProps) => {
    try {
      await updateThreadMutation({
        threadId,
        title,
      });
    } catch (error) {
      handleUpdateThreadError(error);
    }
  };

  /**
   * Handles errors that occur when removing a thread.
   *
   * @param error - The error that occurred during the remove operation
   *
   * @throws {Error} If the error is not a ConvexError, it is re-thrown
   * @throws {ConvexError} If the error code is not handled (default case)
   *
   * Error codes handled:
   * - 401: Redirects to login page (user not authenticated)
   * - 403: Shows error toast (user not authorized)
   * - 404: Redirects to not found page (thread not found)
   * - default: Shows generic error toast and re-throws the error
   */
  const handleRemoveThreadError = (error: unknown) => {
    if (!(error instanceof ConvexError)) {
      throw error;
    }

    const code =
      typeof (error.data as { code?: unknown })?.code === "number"
        ? (error.data as { code: number }).code
        : undefined;

    switch (code) {
      case 401:
        router.push(loginPath());
        return;
      case 403:
        toast.error("You are not authorized to remove this thread.");
        return;
      case 404:
        toast.error("Thread not found.");
        router.push("/404");
        return;
      default:
        toast.error("Failed to remove the thread. Please try again.");
        throw error;
    }
  };

  /**
   * Removes a thread.
   *
   * @param props.threadId - The ID of the thread
   *
   * @throws {Error} If the error is not a ConvexError, it is re-thrown
   * @throws {ConvexError} If the error code is not handled (default case)
   *
   * Error codes handled:
   * - 401: Redirects to login page (user not authenticated)
   * - 403: Shows error toast (user not authorized)
   * - 404: Redirects to not found page (thread not found)
   * - default: Shows generic error toast and re-throws the error
   */
  const removeThread = async ({ threadId }: RemoveThreadProps) => {
    try {
      await removeThreadMutation({
        threadId,
      });
    } catch (error) {
      handleRemoveThreadError(error);
    }
  };

  return (
    <ThreadsContext.Provider
      value={{
        threads,
        updateThread,
        removeThread,
      }}
    >
      {children}
    </ThreadsContext.Provider>
  );
}

/**
 * Custom hook to access the threads context.
 *
 * @throws {Error} If the component is not wrapped in a ThreadsProvider
 *
 * @returns The threads context
 */
export function useThreads() {
  const context = useContext(ThreadsContext);

  if (!context) {
    throw new Error("useThreads must be used within ThreadsProvider");
  }

  return context;
}
