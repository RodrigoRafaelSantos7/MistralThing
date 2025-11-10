import type { SVGProps } from "react";
import { Codestral } from "@/components/icons/codestral";
import { Magistral } from "@/components/icons/magistral";
import { Medium } from "@/components/icons/medium";
import { Small } from "@/components/icons/small";
import type { ModelIcon } from "@/types/model-icons";

interface ModelIconProps extends SVGProps<SVGSVGElement> {
  icon: ModelIcon;
}

const ModelIconComponent = ({ icon, ...props }: ModelIconProps) => {
  const icons: Record<
    ModelIcon,
    React.ComponentType<SVGProps<SVGSVGElement>>
  > = {
    codestral: Codestral,
    magistral: Magistral,
    medium: Medium,
    small: Small,
  };

  const Icon = icons[icon];

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
};

export default ModelIconComponent;
