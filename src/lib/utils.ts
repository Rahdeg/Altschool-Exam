import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatISODate(
  isoString: string,
  dateFormat = "dd/MM/yyyy"
): string {
  if (!isoString) return "";

  try {
    const date = parseISO(isoString);
    return format(date, dateFormat);
  } catch (error) {
    console.error("Invalid date:", error);
    return "";
  }
}

export const priorityColor: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

// 🎨 Status colors
export const statusColor: Record<string, string> = {
  TODO: "bg-[#008f0a] text-white",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};
