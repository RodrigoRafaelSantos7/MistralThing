import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { AppearanceView } from "@/modules/account/ui/views/appearance-view";

const Page = async () => {
  const token = await getToken();
  const settings = await preloadQuery(api.settings.get, {}, { token });

  if (!settings) {
    return null;
  }

  return <AppearanceView preloadedSettings={settings} />;
};

export default Page;
