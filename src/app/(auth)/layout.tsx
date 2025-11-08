import type { Metadata } from "next";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";

export const metadata: Metadata = {
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
