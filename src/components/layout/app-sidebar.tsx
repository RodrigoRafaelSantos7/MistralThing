"use client";

import { useForm } from "@tanstack/react-form";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, useState } from "react";
import z from "zod";
import { DynamicImage } from "@/components/app/dynamic-image";
import { AppSidebarKeyboardShortcuts } from "@/components/app/sidebar-keyboard-shortcuts";
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
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThreadsByTimeRange } from "@/hooks/use-chats-by-time-range";
import { useThreads } from "@/hooks/use-database";
import { useParamsThreadId } from "@/hooks/use-params-thread-id";
import { cn } from "@/lib/utils";
import { indexPath } from "@/paths";
import type { Thread } from "@/types/threads";

export function AppSidebar() {
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);
  const [threadToEdit, setThreadToEdit] = useState<Thread | null>(null);

  return (
    <Sidebar>
      <AppSidebarHeader />
      <SidebarContent>
        <AppSidebarActions />
        <AppSidebarThreads
          setThreadToDelete={setThreadToDelete}
          setThreadToEdit={setThreadToEdit}
        />
      </SidebarContent>
      <AppSidebarKeyboardShortcuts />
      <EditThreadTitleDialog
        setThreadToEdit={setThreadToEdit}
        thread={threadToEdit}
      />
      <DeleteThreadDialog
        setThreadToDelete={setThreadToDelete}
        thread={threadToDelete}
      />
    </Sidebar>
  );
}

function AppSidebarHeader() {
  return (
    <SidebarHeader className="p-3">
      <Button asChild size="icon" variant="ghost">
        <Link href={indexPath()}>
          <DynamicImage
            alt="Mistral Thing Logo"
            darkSrc="/icon-white.svg"
            height={24}
            lightSrc="/icon.svg"
            width={24}
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
                <span className="flex-1">New Thread</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarThreads({
  setThreadToEdit,
  setThreadToDelete,
}: {
  setThreadToEdit: (thread: Thread) => void;
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const { threads } = useThreads();
  const groups = useThreadsByTimeRange(threads ?? []);

  return (
    <>
      <ThreadGroup
        label="Today"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.today}
      />
      <ThreadGroup
        label="Yesterday"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.yesterday}
      />
      <ThreadGroup
        label="Last 30 Days"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.lastThirtyDays}
      />
      <ThreadGroup
        label="History"
        setThreadToDelete={setThreadToDelete}
        setThreadToEdit={setThreadToEdit}
        threads={groups.history}
      />
      <p className="p-4 text-muted-foreground/50 text-sm">
        You've reached the end of your threads.
      </p>
    </>
  );
}

function ThreadGroup({
  threads,
  label,
  setThreadToEdit,
  setThreadToDelete,
}: {
  threads: Thread[];
  label: string;
  setThreadToEdit: (thread: Thread) => void;
  setThreadToDelete: (thread: Thread) => void;
}) {
  if (threads.length === 0) {
    return null;
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {threads.map((thread) => (
            <ThreadItem
              key={thread._id}
              setThreadToDelete={setThreadToDelete}
              setThreadToEdit={setThreadToEdit}
              thread={thread}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ThreadItem({
  thread,
  setThreadToEdit,
  setThreadToDelete,
}: {
  thread: Thread;
  setThreadToEdit: (thread: Thread) => void;
  setThreadToDelete: (thread: Thread) => void;
}) {
  const threadId = useParamsThreadId();
  const router = useRouter();
  const isActive = threadId === thread._id;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div className="group/thread-item relative">
          <Link
            className={cn(
              "absolute inset-0 flex w-full items-center gap-2 rounded-md px-2",
              isActive && "bg-muted"
            )}
            href={`/${thread._id}`}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.button === 0) {
                router.push(`/${thread._id}`);
              }
            }}
          >
            <span className="flex-1 truncate">{thread.title}</span>
            <Activity
              mode={
                thread.status === "streaming" || thread.status === "submitted"
                  ? "visible"
                  : "hidden"
              }
            >
              <Spinner />
            </Activity>
          </Link>
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex w-full items-center justify-end gap-2 rounded-r-md bg-linear-to-l from-sidebar to-transparent px-4 opacity-0 transition-all duration-100 group-hover/thread-item:opacity-100" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 flex translate-x-full items-center justify-end gap-2 rounded-r-lg px-2 opacity-0 transition-all duration-100 group-hover/thread-item:pointer-events-auto group-hover/thread-item:translate-x-0 group-hover/thread-item:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:bg-transparent hover:text-primary"
                  onClick={() => setThreadToEdit(thread)}
                  size="icon"
                  variant="ghost"
                >
                  <PencilIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Thread Title</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="size-6 hover:text-primary"
                  onClick={() => setThreadToDelete(thread)}
                  size="icon"
                  variant="ghost"
                >
                  <TrashIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Thread</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const MAX_THREAD_TITLE_LENGTH = 100;
const MIN_THREAD_TITLE_LENGTH = 1;
const editThreadTitleSchema = z.object({
  title: z
    .string()
    .min(
      MIN_THREAD_TITLE_LENGTH,
      `Title must be at least ${MIN_THREAD_TITLE_LENGTH} characters`
    )
    .max(
      MAX_THREAD_TITLE_LENGTH,
      `Title must be less than ${MAX_THREAD_TITLE_LENGTH} characters`
    ),
});

function EditThreadTitleDialog({
  thread,
  setThreadToEdit,
}: {
  thread: Thread | null;
  setThreadToEdit: (thread: Thread | null) => void;
}) {
  const { updateThread } = useThreads();
  const form = useForm({
    defaultValues: {
      title: thread?.title ?? "",
    },
    validators: {
      onMount: editThreadTitleSchema,
      onChange: editThreadTitleSchema,
      onSubmit: editThreadTitleSchema,
    },
    onSubmit: ({ value }) => {
      if (!thread) {
        return;
      }

      updateThread({
        threadId: thread._id,
        title: value.title,
      });

      setThreadToEdit(null);
    },
  });

  return (
    <Dialog onOpenChange={() => setThreadToEdit(null)} open={!!thread}>
      <DialogContent
        className="gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="border-foreground/10 border-b bg-sidebar p-6">
          <DialogTitle>Edit Thread Title</DialogTitle>
          <DialogDescription>Edit the title of the thread.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
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
                    if (value.length > MAX_THREAD_TITLE_LENGTH) {
                      return `Title must be less than ${MAX_THREAD_TITLE_LENGTH} characters`;
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
              onClick={() => setThreadToEdit(null)}
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
                  <Activity mode={isSubmitting ? "visible" : "hidden"}>
                    <Spinner />
                  </Activity>
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

function DeleteThreadDialog({
  thread,
  setThreadToDelete,
}: {
  thread: Thread | null;
  setThreadToDelete: (thread: Thread | null) => void;
}) {
  const { deleteThread } = useThreads();
  const threadId = useParamsThreadId();
  const router = useRouter();

  function handleDelete() {
    if (!thread) {
      return;
    }

    deleteThread({ threadId: thread._id });

    if (threadId === thread._id) {
      router.push(indexPath());
    }

    setThreadToDelete(null);
  }

  return (
    <Dialog onOpenChange={() => setThreadToDelete(null)} open={!!thread}>
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
            onClick={() => setThreadToDelete(null)}
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
