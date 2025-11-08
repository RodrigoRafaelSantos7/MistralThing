import type { Metadata } from "next";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

export const metadata: Metadata = {
  title: "Welcome Back",
};

const Page = () => <SignInView />;

export default Page;
