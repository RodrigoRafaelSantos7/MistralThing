import type { Chat } from "@/lib/chat-store/chats/utils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_30 = 30;

type ChatsByTimeRange = {
  today: Chat[];
  yesterday: Chat[];
  lastThirtyDays: Chat[];
  history: Chat[];
};

export function useChatsByTimeRange<T extends Chat>(
  chatsArray: T[]
): ChatsByTimeRange {
  const now = Date.now();

  const timeBoundaries = {
    oneDayAgo: now - MS_PER_DAY,
    twoDaysAgo: now - 2 * MS_PER_DAY,
    thirtyDaysAgo: now - DAYS_30 * MS_PER_DAY,
  };

  const filterChatsByTimeRange = (startTime: number, endTime?: number) =>
    chatsArray.filter((chat) => {
      const chatTime = chat.updatedAt ?? 0;
      return endTime
        ? chatTime >= startTime && chatTime < endTime
        : chatTime >= startTime;
    });

  const groups = {
    today: filterChatsByTimeRange(timeBoundaries.oneDayAgo),
    yesterday: filterChatsByTimeRange(
      timeBoundaries.twoDaysAgo,
      timeBoundaries.oneDayAgo
    ),
    lastThirtyDays: filterChatsByTimeRange(
      timeBoundaries.thirtyDaysAgo,
      timeBoundaries.twoDaysAgo
    ),
    history: filterChatsByTimeRange(0, timeBoundaries.thirtyDaysAgo),
  };

  return groups;
}
