"use client";

import { useParams } from "next/navigation";

// TODO: This hook can be improved
const useParamsThreadSlug = (): string | undefined => {
  const params = useParams();

  const slug = params?.slug;

  if (typeof slug === "string") {
    return slug;
  }

  return Array.isArray(slug) ? slug[0] : undefined;
};

export { useParamsThreadSlug };
