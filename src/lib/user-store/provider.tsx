"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { createContext, useContext } from "react";
import type { api } from "@/convex/_generated/api";

// The type of the user is the return type of the users.get function
type User = FunctionReturnType<typeof api.users.get>;

type UserContextType = {
  /**
   * The current user
   */
  user: User;
};

/**
 * The context for the user
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * The provider for the user context
 *
 * @param initialUser - The initial user preloaded in the server
 * @param children - The children to render
 *
 * @returns The user context provider
 */
export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: Preloaded<typeof api.users.get>;
  children: React.ReactNode;
}) {
  const user = usePreloadedQuery(initialUser);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

/**
 * Custom hook to use the user context
 *
 * @returns The user context
 */
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
