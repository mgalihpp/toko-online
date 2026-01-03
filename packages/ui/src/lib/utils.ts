import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * Get the base URL of the application.
 * @returns The base URL as a string.
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NODE_ENV === "production") return "https://trywear-web.vercel.app";
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
