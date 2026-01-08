import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateInviteCode = (length: number): string => {
  const allowedCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += allowedCharacters.charAt(
      Math.floor(Math.random() * allowedCharacters.length)
    );
  }

  return result;
}

export const capitalCase = (str: string): string => {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}

export const snakeCaseToTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export const formatEfforts = (minutes: number | undefined): string => {
  if (!minutes || minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};