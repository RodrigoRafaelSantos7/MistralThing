import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <AppSidebar />
    <div className="relative flex flex-1 flex-col">
      <Header />
      {children}
    </div>
  </SidebarProvider>
);

export default Layout;
