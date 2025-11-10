"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useThreads } from "@/hooks/use-database";
import { useParamsThreadId } from "@/hooks/use-params-thread-id";

const AppSidebarKeyboardShortcuts = () => {
  const router = useRouter();
  const currentThreadId = useParamsThreadId();
  const { threads } = useThreads();

  const handleOpenShortcut = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      router.push("/");
    },
    [router]
  );

  const handleNavigateThreads = useCallback(
    (e: KeyboardEvent, direction: "up" | "down") => {
      e.preventDefault();
      e.stopPropagation();

      if (!threads || threads.length === 0) {
        return;
      }

      const currentIndex = threads.findIndex(
        (thread) => thread._id === currentThreadId
      );

      if (currentIndex === -1) {
        return;
      }

      const pageLength = threads.length;
      let nextIndex: number;
      if (direction === "up") {
        nextIndex = currentIndex <= 0 ? pageLength - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex >= pageLength - 1 ? 0 : currentIndex + 1;
      }

      const nextThread = threads[nextIndex];

      if (nextThread) {
        router.push(`/${nextThread._id}`);
      }
    },
    [threads, currentThreadId, router]
  );

  const onHandleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMeta = navigator.platform.toLowerCase().includes("mac")
        ? e.metaKey
        : e.ctrlKey;

      if (e.shiftKey && isMeta && (e.key === "o" || e.key === "O")) {
        handleOpenShortcut(e);
        return;
      }

      if (e.shiftKey && e.key === "ArrowUp") {
        handleNavigateThreads(e, "up");
        return;
      }

      if (e.shiftKey && e.key === "ArrowDown") {
        handleNavigateThreads(e, "down");
        return;
      }
    },
    [handleOpenShortcut, handleNavigateThreads]
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
};

export { AppSidebarKeyboardShortcuts };
