import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth/auth-server";
import { ModelsProvider } from "@/lib/models-store/provider";
import { loginPath } from "@/lib/paths";
import { ThreadsProvider } from "@/lib/threads-store/provider";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";
import { UserProvider } from "@/lib/user-store/provider";

export const metadata: Metadata = {
  title: {
    default: "What's on your mind?",
    template: "%s | Mistral Thing",
  },
};

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken();

  if (!token) {
    return redirect(loginPath());
  }

  const [initialSettings, initialModels, initialUser, initialThreads] =
    await Promise.all([
      preloadQuery(api.settings.get, {}, { token }),
      preloadQuery(api.models.list, {}, { token }),
      preloadQuery(api.users.get, {}, { token }),
      preloadQuery(api.threads.getAllThreadsForUserWithMessages, {}, { token }),
    ]);

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider initialModels={initialModels}>
        <UserProvider initialUser={initialUser}>
          <ThreadsProvider initialThreads={initialThreads}>
            {children}
          </ThreadsProvider>
        </UserProvider>
      </ModelsProvider>
    </UserSettingsProvider>
  );
};

export default ProtectedLayout;
