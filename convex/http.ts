import { httpRouter } from "convex/server";
import { streamChat } from "@/convex/chat";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/chat-stream",
  method: "POST",
  handler: streamChat,
});

export default http;
