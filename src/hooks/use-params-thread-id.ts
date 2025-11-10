import { useParams } from "next/navigation";

export function useParamsThreadId() {
  const params = useParams();

  const threadId = params?.threadId;

  return typeof threadId === "string" ? threadId : undefined;
}
