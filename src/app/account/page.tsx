import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { SessionsProvider } from "@/modules/account/providers/sessions-provider";
import AccountView from "@/modules/account/ui/views/account-view";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings and preferences on Mistral Thing",
};

const Page = async () => {
  const token = await getToken();
  const preloadedSessions = await preloadQuery(
    api.users.getAllSessions,
    {},
    { token }
  );

  return (
    <SessionsProvider preloadedSessions={preloadedSessions}>
      <AccountView />
    </SessionsProvider>
  );
};

export default Page;
