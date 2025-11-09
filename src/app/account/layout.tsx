import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { SettingsProvider } from "@/modules/account/providers/settings-provider";
import { AccountLayout } from "@/modules/account/ui/layouts/account-layout";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";

export const metadata: Metadata = {
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();
  const preloadedSettings = await preloadQuery(api.settings.get, {}, { token });

  return (
    <AuthGuard>
      <AccountLayout>
        <SettingsProvider preloadedSettings={preloadedSettings}>
          {children}
        </SettingsProvider>
      </AccountLayout>
    </AuthGuard>
  );
};

export default Layout;
