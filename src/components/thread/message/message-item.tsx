import { useQuery } from "convex/react";
import { AssistantMessage } from "@/components/thread/message/assistant-message";
import { UserMessage } from "@/components/thread/message/user-message";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const MessageItem = ({ id }: { id: Id<"message"> }) => {
  const messageData = useQuery(api.messages.getMessageById, { messageId: id });

  if (!messageData) {
    return null;
  }

  const { role, hasNextMessage, hasPreviousMessage } = messageData;

  if (role === "assistant") {
    return (
      <AssistantMessage
        hasNextMessage={hasNextMessage}
        hasPreviousMessage={hasPreviousMessage}
        message={messageData}
      />
    );
  }

  return (
    <UserMessage
      hasNextMessage={hasNextMessage}
      hasPreviousMessage={hasPreviousMessage}
      message={messageData}
    />
  );
};

export { MessageItem };
