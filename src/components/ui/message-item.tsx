import { memo } from "react";
import { useCurrentThread } from "@/lib/threads-store/session/provider";

export const MessageItem = memo(
  function PureMessageItem({ id }: { id: string }) {
    const { currentThread } = useCurrentThread();
    const message = currentThread?.messages?.find(
      (m) => m._id === id && m.role !== "system"
    );
    const role = message?.role;

    if (role === "assistant") {
      return <div className="mt-20 text-left">{message?.content}</div>;
    }

    return <div className="mt-20 text-right">{message?.content}</div>;
  },
  (prev, next) => prev.id === next.id
);
