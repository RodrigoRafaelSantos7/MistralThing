import { preloadQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsProvider } from "@/lib/model-store/provider";
import { UserSettingsProvider } from "@/lib/user-settings-store/provider";

const DatabaseProvider = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();
  const initialSettings = await preloadQuery(api.settings.get, {}, { token });
  const initialModels = await preloadQuery(api.models.list, {}, { token });

  return (
    <UserSettingsProvider initialSettings={initialSettings}>
      <ModelsProvider initialModels={initialModels}>{children}</ModelsProvider>
    </UserSettingsProvider>
  );
};
export { DatabaseProvider };
