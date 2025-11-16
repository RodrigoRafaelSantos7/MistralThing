"use client";

import { notFound } from "next/navigation";
import { useThreadSession } from "@/lib/threads-store/session/provider";

const ThreadPage = () => {
  const { currentThread } = useThreadSession();

  if (!currentThread) {
    return notFound();
  }

  return <div>ThreadPage {currentThread.slug}</div>;
};

export default ThreadPage;
