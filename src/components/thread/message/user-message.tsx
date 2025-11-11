import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { MessageContainer } from "@/components/thread/message/message-container";
import { PendingMessage } from "@/components/thread/message/pending-message";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import {
  Message,
  MessageAction,
  MessageActions,
} from "@/components/ui/message";
import type { Message as MessageType } from "@/types/thread";

const UserMessage = ({
  message,
  hasPreviousMessage,
  hasNextMessage,
}: {
  message: MessageType;
  hasPreviousMessage: boolean;
  hasNextMessage: boolean;
}) => {
  const [_, copy] = useCopyToClipboard();

  async function handleCopyClick() {
    const text = message.content;

    if (!text) {
      return;
    }

    await copy(text);
    toast.success("Copied to clipboard");
  }

  return (
    <>
      <MessageContainer
        hasNextMessage={true}
        hasPreviousMessage={hasPreviousMessage}
      >
        <Message className="group/user-message flex w-full flex-col items-end">
          <div className="relative flex max-w-[80%] flex-col items-start gap-3 rounded-l-3xl rounded-tr-3xl rounded-br-lg border border-foreground/10 bg-muted px-4 py-3">
            <Markdown>{message.content}</Markdown>
          </div>
          <MessageActions className="gap-1 transition-opacity duration-200 group-hover/user-message:opacity-100 md:opacity-0">
            <MessageAction side="bottom" tooltip="Copy">
              <Button
                className="size-8"
                onClick={handleCopyClick}
                size="icon"
                variant="ghost"
              >
                <CopyIcon className="size-3" />
              </Button>
            </MessageAction>
          </MessageActions>
        </Message>
      </MessageContainer>
      {!hasNextMessage && (
        <MessageContainer
          className="justify-end"
          hasNextMessage={false}
          hasPreviousMessage={true}
        >
          <PendingMessage />
        </MessageContainer>
      )}
    </>
  );
};

export { UserMessage };
