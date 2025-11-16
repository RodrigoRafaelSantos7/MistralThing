"use client";

import { createContext, useContext, useMemo } from "react";
import { useParamsThreadSlug } from "@/hooks/use-params-thread-slug";
import type { Thread } from "@/lib/threads-store/threads/provider";
import { useThreads } from "@/lib/threads-store/threads/provider";

type ThreadSessionContextType = {
  /**
   * The current thread
   */
  currentThread?: Thread;
};

const ThreadSessionContext = createContext<
  ThreadSessionContextType | undefined
>(undefined);

/**
 * Provider for the chat session context
 *
 * @param children - The children to render
 * @returns The chat session provider
 */
export function ThreadSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { threads } = useThreads();
  const slug = useParamsThreadSlug();

  const currentThread = useMemo(
    () => threads.find((t) => t.slug === slug),
    [threads, slug]
  );

  return (
    <ThreadSessionContext.Provider value={{ currentThread }}>
      {children}
    </ThreadSessionContext.Provider>
  );
}

/**
 * Hook to use the thread session context
 *
 * @returns The thread session context
 */
export const useThreadSession = () => {
  const context = useContext(ThreadSessionContext);

  if (!context) {
    throw new Error(
      "useThreadSession must be used within ThreadSessionProvider"
    );
  }

  return context;
};
