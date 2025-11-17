"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { loginPath } from "../paths";

/**
 * The type of a message defined in the database schema.
 */
export type Message = Doc<"message">;

/**
 * The type of a thread defined in the database schema.
 */
export type Thread = Doc<"thread">;

/**
 * The type of a thread with its messages.
 */
export type ThreadWithMessages = Thread & {
  messages: Message[];
};

/**
 * The type of the props for the remove thread function.
 */
type RemoveThreadProps = {
  /**
   * The ID of the thread to remove.
   */
  threadId: Id<"thread">;
};

/**
 * The type of the props for the update thread function.
 */
type UpdateThreadProps = {
  /**
   * The ID of the thread to update.
   */
  threadId: Id<"thread">;

  /**
   * The title of the thread to update.
   */
  title?: string;

  /**
   * The status of the thread to update.
   */
  status?: "ready" | "streaming" | "submitted" | "error";
};

/**
 * The context type for the threads provider.
 */
type ThreadsContextType = {
  /**
   * The threads for the current user (with messages).
   */
  threads: ThreadWithMessages[];

  /**
   * The mutation to remove a thread.
   */
  removeThread: (props: RemoveThreadProps) => void;

  /**
   * The mutation to update a thread.
   */
  updateThread: (props: UpdateThreadProps) => void;
};

/**
 * The context for the threads provider.
 */
const ThreadsContext = createContext<ThreadsContextType | undefined>(undefined);

/**
 * The provider for the threads context.
 *
 * @param initialThreads - The initial threads (including messages) for the current user.
 * @param children - The children to render.
 *
 * @returns The threads provider.
 */
export function ThreadsProvider({
  initialThreads,
  children,
}: {
  children: React.ReactNode;
  initialThreads: Preloaded<
    typeof api.threads.getAllThreadsForUserWithMessages
  >;
}) {
  const router = useRouter();
  const threads = usePreloadedQuery(initialThreads);

  /**
   * The mutation to remove a thread. It is with optimistic updates.
   */
  const removeThreadMutation = useMutation(
    api.threads.remove
  ).withOptimisticUpdate((localStore, { threadId }) => {
    const currentThreads = localStore.getQuery(
      api.threads.getAllThreadsForUserWithMessages
    );

    // If the threads query is loaded, remove the thread optimistically
    if (currentThreads !== undefined) {
      // Filter out the thread to be removed
      const updatedThreads = currentThreads.filter(
        (thread) => thread._id !== threadId
      );

      // Update the local store with the optimistically updated threads
      localStore.setQuery(
        api.threads.getAllThreadsForUserWithMessages,
        {},
        updatedThreads
      );
    }
  });

  /**
   * The mutation to update a thread. It is with optimistic updates.
   */
  const updateThreadMutation = useMutation(
    api.threads.update
  ).withOptimisticUpdate((localStore, { threadId, title, status }) => {
    const currentThreads = localStore.getQuery(
      api.threads.getAllThreadsForUserWithMessages
    );

    // If the threads query is loaded, update it optimistically
    if (currentThreads !== undefined) {
      const updatedThreads = currentThreads.map((thread) =>
        thread._id === threadId
          ? {
              ...thread,
              title: title ?? thread.title,
              status: status ?? thread.status,
              updatedAt: Date.now(),
              messages: thread.messages, // Preserve messages in optimistic update
            }
          : thread
      );

      // Update the local store with the optimistically updated threads
      localStore.setQuery(
        api.threads.getAllThreadsForUserWithMessages,
        {},
        updatedThreads
      );
    }
  });

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

  return (
    <ThreadsContext.Provider
      value={{
        threads,
        removeThread,
        updateThread,
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
