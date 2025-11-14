import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountTabs } from "@/components/account-tabs";
import { BackButton } from "@/components/back-button";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences on Mistral Thing",
};

const AccountLayout = async ({ children }: { children: ReactNode }) => (
  <div className="relative flex flex-1">
    <div className="relative z-1 flex min-h-screen flex-1 overflow-auto">
      <BackButton />
      <div className="w-full p-4">
        <div className="flex flex-1 py-24">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <div>
              <h1 className="font-bold text-2xl">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and configuration.
              </p>
            </div>
            <AccountTabs />
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AccountLayout;
