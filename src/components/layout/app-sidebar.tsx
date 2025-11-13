"use client";

import { useForm } from "@tanstack/react-form";
import { Loader2Icon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import z from "zod";
import { DynamicImage } from "@/components/app/dynamic-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { useChatsByTimeRange } from "@/hooks/use-chats-by-time-range";
import { useChats } from "@/lib/chat-store/chats/provider";
import { useChatSession } from "@/lib/chat-store/session/provider";
import { cn } from "@/lib/utils";
import { chatPath, indexPath } from "@/paths";

type Chat = Doc<"chat">;

export function AppSidebar() {
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <AppSidebarActions />
        <AppSidebarChats
          setChatToDelete={setChatToDelete}
          setChatToEdit={setChatToEdit}
        />
      </SidebarContent>
      <AppSidebarKeyboardShortcuts />
      <EditChatTitleDialog chat={chatToEdit} setChatToEdit={setChatToEdit} />
      <DeleteChatDialog chat={chatToDelete} setChatToDelete={setChatToDelete} />
    </Sidebar>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader className="p-3">
      <Button asChild size="icon" variant="ghost">
        <Link href={indexPath()}>
          <DynamicImage
            alt="Mistral Thing"
            className="size-6"
            darkSrc="/icon-white.svg"
            height={100}
            lightSrc="/icon.svg"
            width={100}
          />
        </Link>
      </Button>
    </SidebarHeader>
  );
}

function AppSidebarActions() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={indexPath()}>
                <PlusIcon />
                <span className="flex-1">New Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarKeyboardShortcuts() {
  const router = useRouter();
  const currentChatId = useChatSession();
  const { chats } = useChats();

  const onHandleKeyDown = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This is a keyboard shortcut handler
    (e: KeyboardEvent) => {
      const isMeta = navigator.platform.toLowerCase().includes("mac")
        ? e.metaKey
        : e.ctrlKey;
      if (e.shiftKey && isMeta && (e.key === "o" || e.key === "O")) {
        e.preventDefault();
        e.stopPropagation();
        router.push(indexPath());
        return;
      }
      if (e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        e.stopPropagation();

        if (chats.length === 0) {
          return;
        }

        const currentIndex = chats.findIndex(
          (chat) => chat._id === currentChatId.chatId
        );

        let nextIndex: number;
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex <= 0 ? chats.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= chats.length - 1 ? 0 : currentIndex + 1;
        }

        const nextChat = chats[nextIndex];
        if (nextChat) {
          router.push(chatPath(nextChat._id));
        }
      }
    },
    [chats, currentChatId, router]
  );

  useEffect(() => {
    const activeEl = document.querySelector(
      '[data-thread-active="true"]'
    ) as HTMLElement | null;
    if (!activeEl) {
      return;
    }

    const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      let parent = el?.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const hasScrollableContent = parent.scrollHeight > parent.clientHeight;
        const overflowY = style.overflowY;
        if (
          hasScrollableContent &&
          (overflowY === "auto" || overflowY === "scroll")
        ) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return (document.scrollingElement as HTMLElement) ?? null;
    };

    const container = getScrollParent(activeEl);
    if (!container) {
      return;
    }

    const isFullyVisible = () => {
      const elRect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return (
        elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom
      );
    };

    if (!isFullyVisible()) {
      activeEl.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onHandleKeyDown);
    return () => document.removeEventListener("keydown", onHandleKeyDown);
  }, [onHandleKeyDown]);

  return null;
}

function AppSidebarChats({
  setChatToEdit,
  setChatToDelete,
}: {
  setChatToEdit: (chat: Chat | null) => void;
  setChatToDelete: (chat: Chat | null) => void;
}) {
  const { chats } = useChats();
  const groups = useChatsByTimeRange(chats);

  return (
    <Fragment>
      <ThreadGroup
        chats={groups.today}
        label="Today"
        setChatToDelete={setChatToDelete}
        setChatToEdit={setChatToEdit}
      />
      <ThreadGroup
        chats={groups.yesterday}
        label="Yesterday"
        setChatToDelete={setChatToDelete}
        setChatToEdit={setChatToEdit}
      />
      <ThreadGroup
        chats={groups.lastThirtyDays}
        label="Last 30 Days"
        setChatToDelete={setChatToDelete}
        setChatToEdit={setChatToEdit}
      />
      <ThreadGroup
        chats={groups.history}
        label="History"
        setChatToDelete={setChatToDelete}
        setChatToEdit={setChatToEdit}
      />
      <p className="p-4 text-muted-foreground/50 text-sm">
        You've reached the end of your threads.
      </p>
    </Fragment>
  );
}

function ThreadGroup({
  chats,
  label,
  setChatToEdit,
  setChatToDelete,
}: {
  chats: Chat[];
  label: string;
  setChatToEdit: (chat: Chat) => void;
  setChatToDelete: (chat: Chat) => void;
}) {
  if (chats.length === 0) {
    return null;
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {chats.map((chat) => (
            <ChatItem
              chat={chat}
              key={chat._id}
              setChatToDelete={setChatToDelete}
              setChatToEdit={setChatToEdit}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ChatItem({
  chat,
  setChatToEdit,
  setChatToDelete,
}: {
  chat: Chat;
  setChatToEdit: (chat: Chat) => void;
  setChatToDelete: (chat: Chat) => void;
}) {
  const currentChatId = useChatSession().chatId;
  const router = useRouter();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div className="group/thread-item relative">
          <Link
            className={cn(
              "absolute inset-0 flex w-full items-center gap-2 rounded-md px-2",
              currentChatId === chat._id && "data-thread-active='true' bg-muted"
            )}
            href={chatPath(chat._id)}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.button === 0) {
                router.push(chatPath(chat._id));
              }
            }}
          >
            <span className="flex-1 truncate">{chat.title}</span>
            {/* TODO: Add loading state */}
            {/**{(chat.status === "streaming" ||
              chat.status === "submitted") && (
              <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            )}*/}
          </Link>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-full items-center justify-end gap-2 rounded-r-md bg-linear-to-l from-sidebar to-transparent px-4 opacity-0 transition-all duration-100 group-hover/thread-item:opacity-100" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex translate-x-full items-center justify-end gap-2 rounded-r-lg px-2 opacity-0 transition-all duration-100 group-hover/thread-item:pointer-events-auto group-hover/thread-item:translate-x-0 group-hover/thread-item:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:bg-transparent hover:text-primary"
                  onClick={() => setChatToEdit(chat)}
                  size="icon"
                  variant="ghost"
                >
                  <PencilIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Chat Title</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:text-primary"
                  onClick={() => setChatToDelete(chat)}
                  size="icon"
                  variant="ghost"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Chat</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const editChatTitleSchema = z.object({
  title: z.string().min(1).max(200),
});

function EditChatTitleDialog({
  chat,
  setChatToEdit,
}: {
  chat: Chat | null;
  setChatToEdit: (chat: Chat | null) => void;
}) {
  const { updateChat } = useChats();
  const form = useForm({
    defaultValues: {
      title: chat?.title ?? "",
    },
    validators: {
      onMount: editChatTitleSchema,
      onChange: editChatTitleSchema,
      onSubmit: editChatTitleSchema,
    },
    onSubmit: ({ value }) => {
      if (!chat) {
        return;
      }

      updateChat({
        id: chat._id,
        title: value.title,
      });
      setChatToEdit(null);
    },
  });

  return (
    <Dialog onOpenChange={() => setChatToEdit(null)} open={!!chat}>
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Edit Chat Title</DialogTitle>
          <DialogDescription>Edit the title of the chat.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-4 bg-background px-6 py-4">
            <div className="grid gap-2">
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    if (value.length === 0) {
                      return "Title is required";
                    }
                    if (value.length > 100) {
                      return "Title must be less than 100 characters";
                    }
                  },
                }}
              >
                {(field) => (
                  <>
                    <Label>Title</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    />
                    {field.state.meta.errors ? (
                      <p className="text-destructive text-sm">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </>
                )}
              </form.Field>
            </div>
          </div>
          <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
            <Button
              onClick={() => setChatToEdit(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  disabled={!canSubmit || isSubmitting}
                  onClick={() => form.handleSubmit()}
                  type="submit"
                >
                  {isSubmitting && (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  )}
                  <span>Save</span>
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteChatDialog({
  chat,
  setChatToDelete,
}: {
  chat: Chat | null;
  setChatToDelete: (chat: Chat | null) => void;
}) {
  const { removeChat } = useChats();
  const router = useRouter();

  function handleDelete() {
    if (!chat) {
      return;
    }
    removeChat({ id: chat._id as Id<"chat"> });
    router.push(indexPath());
    setChatToDelete(null);
  }

  return (
    <Dialog onOpenChange={() => setChatToDelete(null)} open={!!chat}>
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="bg-background p-6">
          <DialogTitle>Delete Thread</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this thread? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="border-foreground/10 border-t bg-sidebar px-6 py-4">
          <Button
            onClick={() => setChatToDelete(null)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} type="button" variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
