import { LayoutApp } from "@/components/layout/layout-app";
import { MessagesProvider } from "@/lib/chat-store/messages/provider";

const Page = () => (
  <MessagesProvider>
    <LayoutApp>Edit Chat Title Delete Chat</LayoutApp>
  </MessagesProvider>
);

export default Page;
