"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import { themes } from "@/lib/themes";

export function ThemeProvider({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const themeValues = themes.flatMap((theme) => [
    `${theme.value}-light`,
    `${theme.value}-dark`,
  ]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="default-dark"
      disableTransitionOnChange
      enableSystem={false}
      storageKey="mistral-thing-theme"
      themes={themeValues}
    >
      {children}
    </NextThemesProvider>
  );
}
