"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { createContext, type ReactNode, useContext } from "react";
import type { api } from "@/convex/_generated/api";

type ThreadsContextValue = {
  threads: ReturnType<
    typeof usePreloadedQuery<typeof api.threads.getAllThreadsOfUser>
  >;
};

const ThreadsContext = createContext<ThreadsContextValue | null>(null);

type ThreadsProviderProps = {
  children: ReactNode;
  preloadedThreads: Preloaded<typeof api.threads.getAllThreadsOfUser>;
};

export function ThreadsProvider({
  children,
  preloadedThreads,
}: ThreadsProviderProps) {
  const threads = usePreloadedQuery(preloadedThreads);

  return (
    <ThreadsContext.Provider value={{ threads }}>
      {children}
    </ThreadsContext.Provider>
  );
}

export function useThreadsContext() {
  const context = useContext(ThreadsContext);
  return context;
}
