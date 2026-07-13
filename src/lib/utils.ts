/**
 * @fileoverview Utility function for class name merging
 * @module lib/utils
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names with Tailwind CSS conflict resolution
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with locale-aware formatting
 * @param value - Number to format
 * @param options - Intl.NumberFormat options
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

/**
 * Formats a date as relative time (e.g., "5 minutes ago")
 * @param date - Date string or Date object
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Truncates text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a unique ID for components
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Maps severity level to CSS class
 */
export function getSeverityClass(severity: string): string {
  const map: Record<string, string> = {
    LOW: "status-low",
    MEDIUM: "status-medium",
    HIGH: "status-high",
    CRITICAL: "status-critical",
  };
  return map[severity] ?? "status-low";
}

/**
 * Returns a color for crowd density (green → yellow → red)
 */
export function getDensityColor(density: number): string {
  if (density < 0.5) return `hsl(142, 76%, 36%)`;
  if (density < 0.75) return `hsl(43, 100%, 50%)`;
  if (density < 0.9) return `hsl(25, 95%, 53%)`;
  return `hsl(0, 80%, 50%)`;
}

/**
 * Delays execution for a specified time
 * @param ms - Milliseconds to delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
