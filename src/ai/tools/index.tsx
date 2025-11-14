import type { Tool, UIMessageStreamWriter } from "ai";
import { getSearchTool } from "@/ai/tools/search-tool";
import type { ThreadMessage } from "@/ai/types";

const tools = {
  search: getSearchTool,
} as const;

type ExtractTool<T> = T extends (...args: any[]) => infer U ? U : never;

export type AvailableTools = {
  [K in keyof typeof tools]: ExtractTool<(typeof tools)[K]>;
};

export type ToolContext = {
  writer: UIMessageStreamWriter<ThreadMessage>;
  tools: string[];
  signal: AbortSignal;
};

export const getTools = (ctx: ToolContext): Record<string, Tool> => {
  const activeTools: Record<string, Tool> = {};

  for (const tool of ctx.tools) {
    activeTools[tool] = tools[tool as keyof typeof tools]();
  }

  return activeTools;
};
