import { Chat } from "@/components/chat/chat";
import { LayoutApp } from "@/components/layout/layout-app";
import { MessagesProvider } from "@/lib/threads-store/messages/provider";

const Page = () => (
  <MessagesProvider>
    <LayoutApp>
      <Chat />
    </LayoutApp>
  </MessagesProvider>
);

export default Page;
