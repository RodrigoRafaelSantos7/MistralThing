"use client";

import { ModelSelector } from "@/components/model-selector";
import { ThemeSelector } from "@/components/theme-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { useParamsThreadSlug } from "@/hooks/use-params-thread-slug";
import { cn } from "@/lib/utils";

const Header = () => {
  const threadSlug = useParamsThreadSlug();

  return (
    <div
      className={cn(
        threadSlug && "border-b",
        "absolute top-0 right-0 left-0 z-10 flex justify-between border-foreground/10 bg-background/50 backdrop-blur-md"
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <SidebarTrigger />
        <ModelSelector />
      </div>
      <div className="flex items-center gap-2 p-3">
        <ThemeSelector />
        <UserMenu />
      </div>
    </div>
  );
};

export { Header };
