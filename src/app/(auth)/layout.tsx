import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
