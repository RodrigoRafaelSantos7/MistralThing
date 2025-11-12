"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { createContext, useContext } from "react";
import { api } from "@/convex/_generated/api";
import type { Chat } from "./utils";

type ChatsContextType = {
  chats: Chat[];
  createChat: (args: { title: string; model: string }) => void;
  updateChat: (args: {
    id: Chat["id"];
    title?: string;
    model?: string;
    updatedAt?: number;
  }) => void;
  removeChat: (args: { id: Chat["id"] }) => void;
  getChatById: (id: Chat["id"]) => Chat | undefined;
};

const ChatsContext = createContext<ChatsContextType | null>(null);

export function ChatsProvider({
  initialChats,
  children,
}: {
  children: React.ReactNode;
  initialChats: Preloaded<typeof api.chats.getAll>;
}) {
  const chatsQueryResult = usePreloadedQuery(initialChats);
  const chats = chatsQueryResult ?? [];

  const createChat = useMutation(api.chats.create).withOptimisticUpdate(
    (localStore, args) => {
      const currentChats = localStore.getQuery(api.chats.getAll, {});
      if (currentChats !== undefined && currentChats !== null) {
        const now = Date.now();
        const tempChat: Chat = {
          id: `temp-${now}` as Chat["id"],
          title: args.title,
          model: args.model,
          userId: "",
          createdAt: now,
          updatedAt: now,
        };
        const updatedChats = [tempChat, ...currentChats];
        localStore.setQuery(api.chats.getAll, {}, updatedChats);
      }
    }
  );

  const updateChat = useMutation(api.chats.update).withOptimisticUpdate(
    (localStore, args) => {
      const currentChats = localStore.getQuery(api.chats.getAll, {});
      if (currentChats !== undefined && currentChats !== null) {
        const updatedChats = currentChats.map((chat) =>
          chat.id === args.id
            ? {
                ...chat,
                ...(args.title !== undefined && { title: args.title }),
                ...(args.model !== undefined && { model: args.model }),
                ...(args.updatedAt !== undefined && {
                  updatedAt: args.updatedAt,
                }),
              }
            : chat
        );
        localStore.setQuery(api.chats.getAll, {}, updatedChats);
      }
    }
  );

  const removeChat = useMutation(api.chats.remove).withOptimisticUpdate(
    (localStore, args) => {
      const currentChats = localStore.getQuery(api.chats.getAll, {});
      if (currentChats !== undefined && currentChats !== null) {
        const updatedChats = currentChats.filter((chat) => chat.id !== args.id);
        localStore.setQuery(api.chats.getAll, {}, updatedChats);
      }
    }
  );

  const getChatById = (id: Chat["id"]) => chats.find((chat) => chat.id === id);

  return (
    <ChatsContext.Provider
      value={{ chats, createChat, updateChat, removeChat, getChatById }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

/**
 * Custom hook to access the chats context.
 *
 * @throws {Error} If the component is not wrapped in a ChatsProvider
 * @returns The chats context
 */
export function useChats() {
  const context = useContext(ChatsContext);

  if (!context) {
    throw new Error("useChats must be used within ChatsProvider");
  }

  return context;
}
