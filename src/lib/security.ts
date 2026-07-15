/**
 * @fileoverview Security utility functions and middleware
 * @module lib/security
 */

import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Apply security headers to a response-like object or a plain Headers instance.
 */
export function addSecurityHeaders<T extends Headers | Response | NextResponse>(response: T): T {
  const headers = response instanceof Headers ? response : response.headers;

  // Prevent XSS
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://api.openai.com; font-src 'self' https://fonts.googleapis.com; frame-ancestors 'none';",
  );

  // CORS
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Performance & Caching
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  return response;
}

/**
 * CORS middleware
 */
export function withCORSHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get("origin") || "";

  // Allow requests from same origin or specified domains
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean);

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  return response;
}

/**
 * Lightweight in-memory rate limiter with a simple sliding-window implementation.
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(maxRequests: number = 100, windowMs: number = 60 * 1000) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  private getActiveTimestamps(key: string, now: number): number[] {
    const windowStart = now - this.windowMs;
    const timestamps = (this.requests.get(key) || []).filter((timestamp) => timestamp > windowStart);

    if (timestamps.length === 0) {
      this.requests.delete(key);
      return [];
    }

    this.requests.set(key, timestamps);
    return timestamps;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.getActiveTimestamps(key, now);

    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const timestamps = this.getActiveTimestamps(key, now);
    return Math.max(0, this.maxRequests - timestamps.length);
  }

  getResetTime(key: string): number {
    const now = Date.now();
    const timestamps = this.getActiveTimestamps(key, now);
    if (timestamps.length === 0) {
      return now + this.windowMs;
    }

    const oldest = timestamps[0] ?? now;
    return oldest + this.windowMs;
  }
}

/**
 * Create a secure session token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return token;
}

/**
 * Hash sensitive data (basic implementation)
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

/**
 * Validate request origin, accepting either a request-like object or a raw origin string.
 */
export function isValidOrigin(value: string | NextRequest | Request | { headers: Headers }): boolean {
  let origin: string | null = null;

  if (typeof value === "string") {
    origin = value;
  } else if (value && typeof value === "object" && "headers" in value) {
    origin = value.headers.get("origin");
  }

  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.toLowerCase();
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    process.env.NEXT_PUBLIC_APP_URL?.toLowerCase() || "",
  ].filter(Boolean);

  return allowedOrigins.some((allowed) => normalizedOrigin === allowed.toLowerCase());
}
