"use client";

import { useMutation } from "convex/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export default function ChatPage() {
  const createThread = useMutation(api.chats.createThread);
  const [threadId, setThreadId] = useState<string | null>(null);
  return (
    <div className="relative flex flex-1 flex-col">
      <Header />

      <div className="mt-32 flex flex-1 flex-col">
        <Button
          onClick={async () => {
            await createThread({
              model: "mistral-small-latest",
            }).then(setThreadId);
          }}
          variant="outline"
        >
          <PlusIcon className="h-4 w-4" />
          New Chat
        </Button>
        {threadId && (
          <div className="flex flex-1 flex-col">
            <p>Thread ID: {threadId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
