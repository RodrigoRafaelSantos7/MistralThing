"use client";

import { useParamsThreadSlug } from "@/hooks/use-params-thread-slug";

const ThreadPage = () => {
  const slug = useParamsThreadSlug();

  if (!slug) {
    return <div>Thread not found</div>;
  }

  return <div>ThreadPage {slug}</div>;
};

export default ThreadPage;
