import { tool } from "ai";
import z from "zod";

export const getSearchTool = () =>
  tool({
    description: "Search the web for information",
    inputSchema: z.object({
      query: z.string(),
    }),
    execute: ({ query }) => search(query),
  });

function search(_query: string) {
  // TODO: Implement search functionality
  throw new Error("Search function not implemented");
}
