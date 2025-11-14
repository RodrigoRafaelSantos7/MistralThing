import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth/auth-server";
import { loginPath } from "@/lib/paths";

export const metadata: Metadata = {
  title: {
    default: "What's on your mind?",
    template: "%s | Mistral Thing",
  },
};

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getToken();

  if (!token) {
    redirect(loginPath());
  }

  return <>{children}</>;
};

export default AuthLayout;
