import { preloadQuery } from "convex/nextjs";
import { ModelsList } from "@/components/app/models-list";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";

const Page = async () => {
  const preloadedModels = await preloadQuery(
    api.models.getAll,
    {},
    {
      token: await getToken(),
    }
  );

  if (!preloadedModels) {
    return <Spinner />;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <title>Models | Mistral Thing</title>
      <ModelsList preloadedModels={preloadedModels} />
    </div>
  );
};

export default Page;
