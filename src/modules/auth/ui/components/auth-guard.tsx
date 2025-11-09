"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const AuthGuard = ({ children }: { children: React.ReactNode }) => (
  <>
    <Authenticated>{children}</Authenticated>
    <Unauthenticated>
      <AuthLayout>
        <SignInView />
      </AuthLayout>
    </Unauthenticated>
    <AuthLoading>
      <AuthLayout>
        <Spinner />
      </AuthLayout>
    </AuthLoading>
  </>
);

export { AuthGuard };
