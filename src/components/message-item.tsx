import { AssistantMessage } from "@/components/assistant-message";
import { UserMessage } from "@/components/user-message";
import type { Message } from "@/lib/threads-store/provider";

type MessageItemProps = {
  message: Message;
  hasPreviousMessage: boolean;
  hasNextMessage: boolean;
  id: string;
};

export const MessageItem = ({
  message,
  hasNextMessage,
  hasPreviousMessage,
  id,
}: MessageItemProps) => {
  if (message.role === "assistant") {
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
};
