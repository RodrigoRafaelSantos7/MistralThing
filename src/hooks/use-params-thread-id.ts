import { useParams } from "next/navigation";

export function useParamsThreadId() {
  const params = useParams();

  const { threadId } = params ?? { threadId: undefined };

  return threadId;
}
