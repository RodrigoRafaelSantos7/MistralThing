import { getUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Mistral Thing",
  url: getUrl(),
  ogImage: `${getUrl()}/og/home`,
  description:
    "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral AI.",
  links: {
    github: "https://github.com/RodrigoRafaelSantos7/MistralThing",
  },
};

export type SiteConfig = typeof siteConfig;
