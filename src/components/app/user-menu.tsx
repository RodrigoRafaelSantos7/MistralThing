"use client";

import {
  BotIcon,
  CreditCardIcon,
  GithubIcon,
  LogInIcon,
  LogOutIcon,
  PaintbrushIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { Anonymous, NotAnonymous } from "@/components/app/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import {
  accountAppearancePath,
  accountModelsPath,
  accountPath,
  accountPreferencesPath,
  accountSubscriptionPath,
  loginPath,
} from "@/paths";

export function UserMenu() {
  const { handleSignOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer outline-none">
        <Button asChild size="icon" variant="ghost">
          <Avatar className="overflow-hidden rounded-md">
            <AvatarImage className="rounded-none" src={""} />
            <AvatarFallback className="rounded-none">R</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] border-foreground/10 bg-background/50 backdrop-blur-md"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <div className="flex flex-col overflow-hidden">
            <div className="truncate text-sm">Rafael Santos</div>
            <div className="truncate text-muted-foreground text-xs">Free</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={accountPath()}>
            <UserIcon className="size-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountSubscriptionPath()}>
            <CreditCardIcon className="size-4" />
            Subscription
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountPreferencesPath()}>
            <SettingsIcon className="size-4" />
            Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountModelsPath()}>
            <BotIcon className="size-4" />
            Models
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={accountAppearancePath()}>
            <PaintbrushIcon className="size-4" />
            Appearance
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={siteConfig.links.github} rel="noreferrer" target="_blank">
            <GithubIcon className="size-4" />
            GitHub
          </Link>
        </DropdownMenuItem>
        <NotAnonymous>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="size-4" />
            Log out
          </DropdownMenuItem>
        </NotAnonymous>
        <Anonymous>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={loginPath()}>
              <LogInIcon className="size-4" />
              Log in
            </Link>
          </DropdownMenuItem>
        </Anonymous>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
