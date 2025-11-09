"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { cn } from "@/lib/utils";

type DynamicImageProps = Omit<ImageProps, "src" | "className"> & {
  lightSrc: ImageProps["src"];
  darkSrc: ImageProps["src"];
  className?: string;
};

const DynamicImage = ({
  lightSrc,
  darkSrc,
  alt,
  className,
  ...props
}: DynamicImageProps) => (
  <>
    <Image
      alt={alt}
      className={cn("dark:hidden", className)}
      src={lightSrc}
      {...props}
    />
    <Image
      alt={alt}
      className={cn("hidden dark:block", className)}
      src={darkSrc}
      {...props}
    />
  </>
);

export { DynamicImage };
