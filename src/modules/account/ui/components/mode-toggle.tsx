"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Activity } from "react";
import { useSettings } from "@/hooks/use-database";
import { cn } from "@/lib/utils";
import type { Mode } from "@/types/modes";

type ModeToggleProps = {
  mode: Mode;
};

const ModeToggle = ({ mode }: ModeToggleProps) => {
  const { updateSettings } = useSettings();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <button
        className={cn(
          "relative w-full cursor-pointer rounded-lg border border-foreground/15 bg-muted/50 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
          mode === "light"
            ? "border-primary/50 bg-primary/5"
            : "border-foreground/10 hover:bg-muted/50"
        )}
        onClick={() => {
          updateSettings({ mode: "light" });
        }}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <SunIcon className="size-4" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Light Mode</div>
            <div className="text-muted-foreground text-sm">
              Bright interface for daytime use
            </div>
          </div>
        </div>
        <Activity mode={mode === "light" ? "visible" : "hidden"}>
          <div className="absolute top-2 right-2">
            <div className="size-2 rounded-full bg-primary" />
          </div>
        </Activity>
      </button>

      <button
        className={cn(
          "relative w-full cursor-pointer rounded-lg border border-foreground/15 bg-muted/50 p-4 text-left backdrop-blur-md transition-all hover:border-foreground/20",
          mode === "dark"
            ? "border-primary/50 bg-primary/5"
            : "border-foreground/10 hover:bg-muted/50"
        )}
        onClick={() => {
          updateSettings({ mode: "dark" });
        }}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <MoonIcon className="size-4" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Dark Mode</div>
            <div className="text-muted-foreground text-sm">
              Dark interface for nighttime use
            </div>
          </div>
        </div>
        <Activity mode={mode === "dark" ? "visible" : "hidden"}>
          <div className="absolute top-2 right-2">
            <div className="size-2 rounded-full bg-primary" />
          </div>
        </Activity>
      </button>
    </div>
  );
};

export { ModeToggle };
