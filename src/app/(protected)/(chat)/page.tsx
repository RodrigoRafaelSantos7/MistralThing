import { Chat } from "@/components/chat/chat";
import { LayoutApp } from "@/components/layout/layout-app";
import { MessagesProvider } from "@/lib/threads-store/messages/provider";

export default function Page() {
  return (
    <MessagesProvider>
      <LayoutApp>
        <Chat />
      </LayoutApp>
    </MessagesProvider>
  );
}
