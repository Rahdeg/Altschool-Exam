import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { parseISO, format } from "date-fns";

export function formatISODate(isoString, dateFormat = "dd/MM/yyyy") {
  if (!isoString) return "";

  try {
    const date = parseISO(isoString);
    return format(date, dateFormat);
  } catch (error) {
    console.error("Invalid date:", error);
    return "";
  }
}

export const priorityColor = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

// 🎨 Status colors
export const statusColor = {
  TODO: "bg-[#008f0a] text-white",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};
