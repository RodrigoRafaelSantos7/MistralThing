import ChatLayout from "@/components/chat-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CurrentThreadProvider } from "@/lib/threads-store/session/provider";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <CurrentThreadProvider>
    <SidebarProvider>
      <ChatLayout>{children}</ChatLayout>
    </SidebarProvider>
  </CurrentThreadProvider>
);

export default Layout;
