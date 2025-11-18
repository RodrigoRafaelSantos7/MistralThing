import { CopyIcon } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { MessageContainer } from "@/components/message-container";
import { PendingMessage } from "@/components/pending-message";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import { useCurrentThread } from "@/lib/threads-store/session/provider";
import { cn } from "@/lib/utils";

export const AssistantMessage = memo(function PureAssistantMessage({
  id,
  hasNextMessage,
  hasPreviousMessage,
}: {
  id: string;
  hasPreviousMessage: boolean;
  hasNextMessage: boolean;
}) {
  const { currentThread } = useCurrentThread();
  const status = currentThread?.status;
  const message = currentThread?.messages?.find((m) => m._id === id);

  if (message?.content?.length === 0) {
    return (
      <MessageContainer
        className="justify-start"
        hasNextMessage={false}
        hasPreviousMessage={true}
      >
        <PendingMessage />
      </MessageContainer>
    );
  }

  return (
    <MessageContainer
      className="justify-start"
      hasNextMessage={hasNextMessage}
      hasPreviousMessage={hasPreviousMessage}
    >
      <Message className="flex w-full flex-col items-start">
        <MessageContent markdown>{message?.content as string}</MessageContent>
        {(status !== "streaming" && status !== "submitted") ||
        hasNextMessage ? (
          <Actions id={id} />
        ) : (
          <MessageActions
            className={cn("gap-1 opacity-100 transition-opacity duration-200")}
          >
            <Button className="size-8" size="icon" variant="ghost" />
          </MessageActions>
        )}
      </Message>
    </MessageContainer>
  );
});

const Actions = memo(function PureActions({ id }: { id: string }) {
  const { currentThread } = useCurrentThread();
  const message = currentThread?.messages?.find((m) => m._id === id);
  return (
    <MessageActions
      className={cn("gap-1 opacity-100 transition-opacity duration-200")}
    >
      <MessageAction side="bottom" tooltip="Copy">
        <Button
          className="size-8"
          onClick={async () => {
            await navigator.clipboard.writeText(message?.content ?? "");
            toast.success("Copied to clipboard");
          }}
          size="icon"
          variant="ghost"
        >
          <CopyIcon className="size-3" />
        </Button>
      </MessageAction>
    </MessageActions>
  );
});
