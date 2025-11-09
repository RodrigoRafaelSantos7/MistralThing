"use client";

import { Activity } from "react";
import { THEMES } from "@/config/themes";
import { useSettings } from "@/hooks/use-database";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types/modes";
import type { Theme } from "@/types/themes";

type ThemeToggleProps = {
  theme: Theme;
  mode: Mode;
};

const ThemeToggle = ({ theme, mode }: ThemeToggleProps) => {
  const { updateSettings } = useSettings();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {THEMES.map((themeOption) => (
        <button
          className={cn(
            "relative w-full cursor-pointer overflow-hidden rounded-lg border bg-background/10 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
            themeOption.value === theme
              ? "border-primary/50 bg-primary/5"
              : "border-foreground/10 hover:bg-muted/50"
          )}
          key={themeOption.value}
          onClick={() => {
            updateSettings({ theme: themeOption.value });
          }}
          type="button"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-medium text-sm">{themeOption.name}</div>
              <div className="text-muted-foreground text-xs">
                {themeOption.description}
              </div>
            </div>
          </div>
          <Activity mode={themeOption.value === theme ? "visible" : "hidden"}>
            <div className="absolute top-2 right-2">
              <div className="size-2 rounded-full bg-primary" />
            </div>
          </Activity>
          <div className="absolute right-0 bottom-0 left-0 flex">
            <div
              className={cn(
                themeOption.value,
                mode,
                "size-4 flex-1 bg-primary"
              )}
            />
            <div
              className={cn(
                themeOption.value,
                mode,
                "size-4 flex-1 bg-secondary"
              )}
            />
            <div
              className={cn(themeOption.value, mode, "size-4 flex-1 bg-accent")}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export { ThemeToggle };
