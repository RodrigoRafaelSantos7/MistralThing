"use client";

import { useParamsThreadId } from "@/hooks/use-params-thread-id";

const ThreadPage = () => {
  const threadId = useParamsThreadId();

  if (!threadId) {
    return <div>Thread not found</div>;
  }

  return <div>ThreadPage {threadId}</div>;
};

export default ThreadPage;
