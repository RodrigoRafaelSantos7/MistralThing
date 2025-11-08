import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  EXTENSIVE_THEMES,
  STORAGE_KEY,
} from "@/config/themes";

const Providers = ({ children }: { children: ReactNode }) => (
  <ConvexClientProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme={`${DEFAULT_THEME}-${DEFAULT_MODE}`}
      disableTransitionOnChange
      enableSystem={false}
      storageKey={STORAGE_KEY}
      themes={EXTENSIVE_THEMES}
    >
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  </ConvexClientProvider>
);

export default Providers;
