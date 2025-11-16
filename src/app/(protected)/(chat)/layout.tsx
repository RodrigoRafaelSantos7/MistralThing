import ChatLayout from "@/components/chat-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThreadSessionProvider } from "@/lib/threads-store/session/provider";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <ThreadSessionProvider>
    <SidebarProvider>
      <ChatLayout>{children}</ChatLayout>
    </SidebarProvider>
  </ThreadSessionProvider>
);

export default Layout;
