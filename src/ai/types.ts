import type {
  InferUITool,
  ReasoningUIPart,
  UIMessage,
  UIMessagePart,
} from "ai";
import type { AvailableTools } from "@/ai/tools";

export const Capabilities = {
  REASONING: "reasoning",
  TOOLS: "tools",
  VISION: "vision",
  DOCUMENTS: "documents",
} as const;

export type Capability = (typeof Capabilities)[keyof typeof Capabilities];

export type Metadata = {
  model?: {
    id: string;
    name: string;
    icon: string;
  };
};

export type ReasoningTimePart = {
  id: string;
  type: "start" | "end";
  timestamp: number;
};

export type DataParts = {
  error: string;
  "reasoning-time": ReasoningTimePart;
};

export type Tools = {
  search: InferUITool<AvailableTools["search"]>;
};

export type ThreadMessage = UIMessage<Metadata, DataParts, Tools>;

export type MessagePart = UIMessagePart<DataParts, Tools>;

export type CustomReasoningUIPart = ReasoningUIPart & {
  startTime: number | null;
  endTime: number | null;
};

export type TransformedMessagePart =
  | Exclude<MessagePart, ReasoningUIPart>
  | CustomReasoningUIPart;

export type DataKeys = Exclude<
  ThreadMessage["parts"][number]["type"],
  | "reasoning"
  | "step-start"
  | "text"
  | "source-url"
  | "source-document"
  | "file"
>;

export type ToolKeys = keyof Tools;
