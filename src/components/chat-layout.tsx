import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

const ChatLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-dvh w-full overflow-hidden bg-background">
    <AppSidebar />
    <main className="@container relative h-dvh w-0 shrink grow overflow-y-auto">
      <Header />
      {children}
    </main>
  </div>
);

export default ChatLayout;
