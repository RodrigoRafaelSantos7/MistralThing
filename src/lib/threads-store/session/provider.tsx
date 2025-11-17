"use client";

import { createContext, useContext, useMemo } from "react";
import { useParamsThreadSlug } from "@/hooks/use-params-thread-slug";
import {
  type ThreadWithMessages,
  useThreads,
} from "@/lib/threads-store/provider";

/**
 * The context type for the threads provider.
 */
type CurrentThreadContextType = {
  /**
   * The current thread (with messages).
   */
  currentThread?: ThreadWithMessages;
};

/**
 * The context for the threads provider.
 */
const CurrentThreadContext = createContext<
  CurrentThreadContextType | undefined
>(undefined);

/**
 * The provider for the threads context.
 *
 * @param initialThreads - The initial threads (including messages) for the current user.
 * @param children - The children to render.
 *
 * @returns The threads provider.
 */
export function CurrentThreadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const slug = useParamsThreadSlug();
  const { threads } = useThreads();

  const currentThread = useMemo(
    () => threads.find((thread) => thread.slug === slug),
    [threads, slug]
  );

  return (
    <CurrentThreadContext.Provider
      value={{
        currentThread,
      }}
    >
      {children}
    </CurrentThreadContext.Provider>
  );
}

/**
 * Custom hook to access the current thread context.
 *
 * @throws {Error} If the component is not wrapped in a CurrentThreadProvider
 *
 * @returns The thread session context
 */
export function useCurrentThread() {
  const context = useContext(CurrentThreadContext);

  if (!context) {
    throw new Error(
      "useCurrentThread must be used within CurrentThreadProvider"
    );
  }

  return context;
}
