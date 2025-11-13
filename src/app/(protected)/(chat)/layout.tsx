import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <AppSidebar />
      <main className="@container relative h-dvh w-0 shrink grow overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  </SidebarProvider>
);

export default Layout;
