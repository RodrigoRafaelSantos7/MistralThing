"use client";

import { notFound } from "next/navigation";
import { MessageList } from "@/components/message-list";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

const Page = () => {
  const { currentThread } = useCurrentThread();

  if (!currentThread) {
    notFound();
  }

  return <MessageList />;
};

export default Page;
