"use client";

import { notFound } from "next/navigation";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

const Page = () => {
  const { currentThread } = useCurrentThread();

  if (!currentThread) {
    notFound();
  }

  return (
    <div className="mt-20 flex flex-1 flex-col">
      <h1 className="font-bold text-2xl">
        {currentThread.messages?.map((message) => message.content).join("\n")}
      </h1>
    </div>
  );
};

export default Page;
