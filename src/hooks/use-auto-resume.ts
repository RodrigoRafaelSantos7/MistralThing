import { useEffect, useRef } from "react";
import { useThreads } from "@/hooks/use-database";
import { useParamsThreadId } from "@/hooks/use-params-thread-id";

export function useAutoResume() {
  const threadId = useParamsThreadId();
  const { threads } = useThreads();
  const thread = threads?.find((t) => t._id === threadId);
  const hasResumedRef = useRef(false);

  useEffect(() => {
    // Reset the resume flag when thread changes
    if (threadId) {
      hasResumedRef.current = false;
    }
  }, [threadId]);

  useEffect(() => {
    if (
      thread?.status &&
      (thread.status === "streaming" || thread.status === "submitted") &&
      !hasResumedRef.current
    ) {
      hasResumedRef.current = true;
    }
  }, [thread?.status]);
}
