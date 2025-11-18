import { memo } from "react";
import { AssistantMessage } from "@/components/assistant-message";
import { UserMessage } from "@/components/user-message";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

export const MessageItem = memo(
  function PureMessageItem({ id }: { id: string }) {
    const { currentThread } = useCurrentThread();
    const messages =
      currentThread?.messages?.filter((m) => m.role !== "system") ?? [];
    const messageIndex = messages.findIndex((m) => m._id === id);
    const message =
      messageIndex === -1 ? undefined : (messages[messageIndex] ?? undefined);
    const role = message?.role;

    const hasPreviousMessage = messageIndex > 0;
    const hasNextMessage =
      messageIndex > -1 && messageIndex < messages.length - 1;

    if (role === "assistant") {
      return (
        <AssistantMessage
          hasNextMessage={hasNextMessage}
          hasPreviousMessage={hasPreviousMessage}
          id={id}
        />
      );
    }

    return (
      <UserMessage
        hasNextMessage={hasNextMessage}
        hasPreviousMessage={hasPreviousMessage}
        id={id}
      />
    );
  },
  (prev, next) => prev.id === next.id
);
