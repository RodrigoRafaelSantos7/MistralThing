"use client";

import { useQuery } from "convex/react";
import { useEffect, useMemo, useRef } from "react";
import { StickToBottom, useStickToBottom } from "use-stick-to-bottom";
import { Virtualizer, type VirtualizerHandle } from "virtua";
import { ChatInput } from "@/components/chat-input";
import { MessageItem } from "@/components/message-item";
import { api } from "@/convex/_generated/api";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

export function MessageList() {
  const mounted = useRef(false);
  const ref = useRef<VirtualizerHandle>(null);
  const { currentThread } = useCurrentThread();
  const messages = useQuery(
    api.messages.listByThread,
    currentThread?._id ? { threadId: currentThread._id } : "skip"
  );

  const filteredMessages = useMemo(
    () => (messages ?? [])?.filter((m) => m.role !== "system"),
    [messages]
  );

  const messageIds = useMemo(
    () => filteredMessages.map((message) => message._id),
    [filteredMessages]
  );
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
        {filteredMessages.map((message, index) => (
          <MessageItem
            hasNextMessage={index < filteredMessages.length - 1}
            hasPreviousMessage={index > 0}
            id={message._id}
            key={message._id}
            message={message}
          />
        ))}
      </Virtualizer>
      <ChatInput />
    </StickToBottom>
  );
}
