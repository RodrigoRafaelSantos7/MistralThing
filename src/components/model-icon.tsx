import type { SVGProps } from "react";
import { Magistral } from "@/components/icons/magistral";
import { Nemo } from "@/components/icons/nemo";
import { Pixtral } from "@/components/icons/pixtral";
import { Small } from "@/components/icons/small";

interface ModelIconProps extends SVGProps<SVGSVGElement> {
  modelId: string;
}

const ModelIconComponent = ({ modelId, ...props }: ModelIconProps) => {
  const icons: Record<string, React.ComponentType<SVGProps<SVGSVGElement>>> = {
    "pixtral-12b-2409": Pixtral,
    "magistral-small-latest": Magistral,
    "open-mistral-nemo": Nemo,
    "mistral-small-latest": Small,
  };

  const Icon = icons[modelId];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
};

export default ModelIconComponent;
