import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { ModelsView } from "@/modules/account/ui/views/models-view";

export const metadata: Metadata = {
  title: "Models",
  description: "Manage your model preferences on Mistral Thing",
};

const Page = async () => {
  const token = await getToken();
  const preloadedModels = await preloadQuery(api.models.getAll, {}, { token });

  return <ModelsView preloadedModels={preloadedModels} />;
};

export default Page;
