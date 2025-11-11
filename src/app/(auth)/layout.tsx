import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Get access to AI models from Mistral. Nearly unlimited tier is free!",
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full min-h-screen min-w-screen flex-col items-center justify-center">
    {children}
  </div>
);

export default Layout;
