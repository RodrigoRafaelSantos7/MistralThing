"use client";

import { notFound, useParams } from "next/navigation";
import { useThreadSession } from "@/lib/threads-store/session/provider";

const ThreadPage = () => {
  const params = useParams();
  const slug = params?.slug;
  const { currentThread } = useThreadSession();

  if (!currentThread || slug !== currentThread.slug) {
    // Might need to use Router since this is a client component
    notFound();
  }

  return <div>ThreadPage {currentThread.slug}</div>;
};

export default ThreadPage;
