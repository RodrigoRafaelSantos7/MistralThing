import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Activity, useMemo, useRef, useState } from "react";
import { match, P } from "ts-pattern";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom-button";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { threadPath } from "@/lib/paths";
import { useThreads } from "@/lib/threads-store/provider";
import { useCurrentThread } from "@/lib/threads-store/session/provider";
import { cn } from "@/lib/utils";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const sendMessage = useMutation(api.chat.sendMessage);
  const { createThread } = useThreads();
  const { currentThread } = useCurrentThread();
  const router = useRouter();
  const status = currentThread?.status;
  const isSubmittingRef = useRef(false);

  const ensureThread = async (): Promise<
    { threadId: Id<"thread">; slug: string } | undefined
  > => {
    if (currentThread?._id && currentThread?.slug) {
      return {
        threadId: currentThread._id,
        slug: currentThread.slug,
      };
    }

    // Otherwise, create a new thread
    const result = await createThread();
    if (!result) {
      return;
    }

    // Navigate to the new thread's URL
    router.push(threadPath(result.slug));

    return {
      threadId: result.threadId,
      slug: result.slug,
    };
  };

  const handleSubmit = async () => {
    if (!input?.trim()) {
      return;
    }

    // Prevent multiple simultaneous submissions
    if (isSubmittingRef.current) {
      return;
    }

    try {
      isSubmittingRef.current = true;

      // Ensure we have a thread before sending the message
      const threadInfo = await ensureThread();
      if (!threadInfo) {
        return;
      }

      await sendMessage({
        threadId: threadInfo.threadId,
        message: input,
      });

      // Reset form state
      setInput("");
    } finally {
      isSubmittingRef.current = false;
    }
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
          className="px-6 pt-6"
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
