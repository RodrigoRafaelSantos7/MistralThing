import { getUrl } from "@/lib/utils";

export const siteConfig = {
  name: "Mistral Thing",
  url: getUrl(),
  ogImage: "https://www.rodrigosantos.dev/og/home",
  description:
    "Mistral Thing is a sleek and modern AI chat application. It allows you to interact with large language models from Mistral AI.",
  links: {
    twitter: "https://links.rodrigosantos.dev/rodrigo-x",
    github: "https://github.com/RodrigoRafaelSantos7/MistralThing",
    linkedin: "https://links.rodrigosantos.dev/rodrigo-li",
    email: "hello@rodrigosantos.dev",
  },
};

export type SiteConfig = typeof siteConfig;
