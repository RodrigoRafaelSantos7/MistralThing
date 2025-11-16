"use client";

import { useParams } from "next/navigation";

export function useParamsThreadSlug(): string | undefined {
  const params = useParams();
  const slug = params?.slug;
  return slug?.at(0);
}
