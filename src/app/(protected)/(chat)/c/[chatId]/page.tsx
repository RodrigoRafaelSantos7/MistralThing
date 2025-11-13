"use client";

import { useChatSession } from "@/lib/chat-store/session/provider";

const ChatPage = () => {
  const currentChatId = useChatSession();
  return (
    <div className="mt-60">
      Edit Chat Title Delete Chat
      {currentChatId.chatId}
    </div>
  );
};

export default ChatPage;
