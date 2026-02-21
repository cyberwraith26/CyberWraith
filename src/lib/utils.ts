import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes safely
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// Format currency
export const formatCurrency = (
  amount: number,
  currency = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
};

// Truncate long strings
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert slug to title
export const slugToTitle = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => capitalize(word))
    .join(" ");
};

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Check if a URL is external
export const isExternalUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Delay helper for async flows
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Format a relative time string (e.g. "2 days ago")
export const timeAgo = (date: Date | string): string => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];

  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};