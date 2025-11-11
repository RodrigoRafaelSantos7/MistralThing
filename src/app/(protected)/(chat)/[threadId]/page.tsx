"use client";

import { notFound, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MessageList } from "@/components/thread/message/message-list";
import type { Id } from "@/convex/_generated/dataModel";
import { useThreads } from "@/hooks/use-database";

const Page = () => {
  const params = useParams();
  const { threads } = useThreads();
  const thread = threads?.find(
    (t) => t._id === (params.threadId as Id<"thread">)
  );

  if (!thread) {
    return notFound();
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <Header />
      <MessageList thread={thread} />
    </div>
  );
};

export default Page;
