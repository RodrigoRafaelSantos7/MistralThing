import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThreadsProvider } from "@/components/providers/threads-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { loginPath } from "@/paths";

const ChatLayout = async ({ children }: { children: ReactNode }) => {
  const token = await getToken();

  if (!token) {
    redirect(loginPath());
  }
  const preloadedThreads = await preloadQuery(
    api.threads.getAllThreadsOfUser,
    {},
    { token }
  );

  return (
    <SidebarProvider>
      <ThreadsProvider preloadedThreads={preloadedThreads}>
        <AppSidebar />
        {children}
      </ThreadsProvider>
    </SidebarProvider>
  );
};

export default ChatLayout;
