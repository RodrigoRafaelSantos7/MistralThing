"use client";

import { useEffect, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";
import { ChatInput } from "@/components/chat-input";
import { MessageItem } from "@/components/message-item";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

export function MessageList() {
  const mounted = useRef(false);
  const ref = useRef<VirtualizerHandle>(null);
  const { currentThread } = useCurrentThread();
  const messageIds =
    currentThread?.messages
      ?.filter((m) => m.role !== "system")
      ?.map((message) => message._id) ?? [];
  const isStreaming = currentThread?.status === "streaming";

  const instance = useStickToBottom({
    initial: "instant",
    resize: isStreaming ? "smooth" : "instant",
  });

  useEffect(() => {
    if (mounted.current) {
      return;
    }

    ref.current?.scrollToIndex(messageIds.length - 1, {
      align: "end",
    });

    const timer = setTimeout(() => {
      mounted.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, [messageIds.length]);

  return (
    <StickToBottom
      className="absolute top-0 right-0 bottom-4 left-0"
      instance={instance}
    >
      <Virtualizer
        as={StickToBottom.Content}
        ref={ref}
        scrollRef={instance.scrollRef}
        ssrCount={messageIds?.length ?? 0}
      >
        {messageIds.map((id) => (
          <MessageItem id={id} key={id} />
        ))}
      </Virtualizer>
      <ChatInput />
    </StickToBottom>
  );
}
