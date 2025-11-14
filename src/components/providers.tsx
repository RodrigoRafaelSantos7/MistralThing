import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    {children}
    <Analytics />
    <Toaster position="top-center" />
  </ConvexClientProvider>
);

export { Providers };
