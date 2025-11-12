import { preloadQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ChatsProvider } from "@/lib/chat-store/chats/provider";
import { ChatSessionProvider } from "@/lib/chat-store/session/provider";
import { ModelsProvider } from "@/lib/model-store/provider";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";
import { UserProvider } from "@/lib/user-store/provider";

const DatabaseProvider = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();

  const [initialSettings, initialModels, initialUser, initialChats] =
    await Promise.all([
      preloadQuery(api.settings.get, {}, { token }),
      preloadQuery(api.models.list, {}, { token }),
      preloadQuery(api.users.get, {}, { token }),
      preloadQuery(api.chats.getAll, {}, { token }),
    ]);

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider initialModels={initialModels}>
        <UserProvider initialUser={initialUser}>
          <ChatsProvider initialChats={initialChats}>
            <ChatSessionProvider>{children}</ChatSessionProvider>
          </ChatsProvider>
        </UserProvider>
      </ModelsProvider>
    </UserSettingsProvider>
  );
};
export { DatabaseProvider };
