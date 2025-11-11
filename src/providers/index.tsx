import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    {children}
    <Toaster position="top-center" />
  </ConvexClientProvider>
);

export default Providers;
