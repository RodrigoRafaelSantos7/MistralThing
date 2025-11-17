import { motion } from "framer-motion";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Activity, useMemo, useState } from "react";
import { match, P } from "ts-pattern";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom-button";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { useCurrentThread } from "@/lib/threads-store/session/provider";
import { cn } from "@/lib/utils";

const ChatInput = () => {
  const [input, setInput] = useState("");
  // const { sendMessage } = useThreadContext();
  const { currentThread } = useCurrentThread();
  const status = currentThread?.status;

  const handleSubmit = async () => {
    if (!input?.trim()) {
      return;
    }

    await console.log(input);

    // Reset form state
    setInput("");
  };

  const matcher = useMemo(
    () =>
      match({
        status,
        input,
      }),
    [status, input]
  );

  return (
    <motion.form
      className={cn({
        "absolute flex flex-col gap-4 px-4 pt-4": true,
        "right-0 bottom-0 left-0": true,
        "top-[25vh]": !currentThread?._id,
      })}
      layoutId="multi-modal-input"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit();
      }}
      transition={{ type: "spring", stiffness: 1000, damping: 40 }}
    >
      <Activity mode={currentThread ? "hidden" : "visible"}>
        <motion.div
          animate={{ opacity: 1 }}
          className="mx-auto max-w-3xl font-serif"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl">Hello, What's on your mind?</h2>
        </motion.div>
      </Activity>
      <ScrollToBottomButton variant="default" />
      <PromptInput
        className="mx-auto w-full max-w-3xl overflow-hidden border-foreground/10 bg-muted/50 p-0 backdrop-blur-md"
        onSubmit={handleSubmit}
        onValueChange={setInput}
        value={input}
      >
        <PromptInputTextarea
          className="px-6"
          placeholder="Ask me anything..."
        />
        <PromptInputActions className="flex items-center px-3 pb-3">
          <div className="flex-1" />
          <PromptInputAction
            tooltip={matcher
              .with(
                {
                  input: P.string.maxLength(0),
                  status: "ready",
                },
                () => "Message cannot be empty"
              )
              .otherwise(() => "Send message")}
          >
            <Button
              className="h-8 w-8 rounded-full"
              disabled={matcher
                .with(
                  {
                    input: P.string.maxLength(0),
                    status: "ready",
                  },
                  () => true
                )
                .with(
                  { status: P.union("streaming", "submitted") },
                  () => false
                )
                .otherwise(() => false)}
              size="icon"
              type="submit"
              variant="default"
            >
              {status === "streaming" || status === "submitted" ? (
                <SquareIcon className="size-5 fill-current" />
              ) : (
                <ArrowUpIcon className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </motion.form>
  );
};

export { ChatInput };
