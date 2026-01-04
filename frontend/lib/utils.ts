import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localDateTimeArrayToUTCDate(arr: number[]): Date {
  const [year, month, day, hour, minute, second, nano] = arr;
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, nano / 1_000_000),
  );
}

export function formatToLongLocalStringWithTZ(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function convertToCSV<T extends Record<string, unknown>>(data: T[]) {
  if (!data.length) return "";

  // Collect all unique keys across all rows
  const headers = Array.from(new Set(data.flatMap((row) => Object.keys(row))));

  const rows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}
