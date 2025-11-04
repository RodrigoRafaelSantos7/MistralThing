import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUrl = () =>
  env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mistral-thing.vercel.app";
