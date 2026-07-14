/**
 * @fileoverview Zod validation schemas for all API inputs
 * @module lib/validators
 */

import { z } from "zod";

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const IdSchema = z.object({
  id: z.string().cuid("Invalid ID format"),
});

// =============================================================================
// CHAT SCHEMAS
// =============================================================================

export const ChatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long (max 2000 characters)")
    .trim()
    .transform((val) => sanitizeInput(val)),
  sessionType: z
    .enum([
      "NAVIGATION",
      "CROWD",
      "MULTILINGUAL",
      "ACCESSIBILITY",
      "TRANSPORTATION",
      "SUSTAINABILITY",
      "VOLUNTEER",
      "OPERATIONS",
      "GENERAL",
    ])
    .default("GENERAL"),
  language: z
    .enum(["en", "es", "fr", "ar", "hi", "pt", "ja", "de", "ko", "zh"])
    .default("en"),
  sessionId: z.string().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

// =============================================================================
// SECURITY & SANITIZATION
// =============================================================================

/**
 * Sanitize user input to prevent XSS attacks
 * Removes HTML tags and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim()
    .substring(0, 2000);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Safely parse JSON
 */
export function safeParseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
}

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number",
      ),
    confirmPassword: z.string(),
    role: z.enum(["FAN", "VOLUNTEER", "STAFF", "ORGANIZER"]).default("FAN"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// =============================================================================
// INCIDENT SCHEMAS
// =============================================================================

export const CreateIncidentSchema = z.object({
  stadiumId: z.string().cuid(),
  type: z.enum([
    "CROWD_CONGESTION",
    "MEDICAL",
    "SECURITY",
    "INFRASTRUCTURE",
    "WEATHER",
    "OTHER",
  ]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  title: z.string().min(3).max(200).trim(),
  description: z.string().min(10).max(5000).trim(),
  location: z.string().min(2).max(200).trim(),
});

export const UpdateIncidentSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  aiSummary: z.string().max(5000).optional(),
});

// =============================================================================
// NAVIGATION SCHEMAS
// =============================================================================

export const NavigationRequestSchema = z.object({
  from: z.string().min(1).max(200).trim(),
  to: z.string().min(1).max(200).trim(),
  stadiumId: z.string().cuid(),
  isAccessible: z.boolean().default(false),
  language: z.enum(["en", "es", "fr", "ar", "hi", "pt", "ja", "de", "ko", "zh"]).default("en"),
});

// =============================================================================
// TRANSPORT SCHEMAS
// =============================================================================

export const TransportRequestSchema = z.object({
  origin: z.string().min(1).max(200).trim(),
  stadiumId: z.string().cuid(),
  preferEco: z.boolean().default(true),
  isAccessible: z.boolean().default(false),
  language: z.enum(["en", "es", "fr", "ar", "hi", "pt", "ja", "de", "ko", "zh"]).default("en"),
});

// =============================================================================
// VOLUNTEER SCHEMAS
// =============================================================================

export const VolunteerTaskSchema = z.object({
  volunteerId: z.string().cuid(),
  query: z.string().min(1).max(1000).trim(),
  zone: z.string().max(100).optional(),
});

// =============================================================================
// USER PREFERENCE SCHEMAS
// =============================================================================

export const UserPreferenceSchema = z.object({
  language: z.enum(["en", "es", "fr", "ar", "hi", "pt", "ja", "de", "ko", "zh"]).optional(),
  accessibilityMode: z.boolean().optional(),
});
