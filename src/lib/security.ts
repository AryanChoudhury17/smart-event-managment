/**
 * @fileoverview Security utility functions and middleware
 * @module lib/security
 */

import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Apply security headers to responses
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://api.openai.com; font-src 'self' https://fonts.googleapis.com; frame-ancestors 'none';",
  );

  // CORS
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Performance & Caching
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

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
 * Rate limiting middleware
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = (this.requests.get(key) || []).filter((t) => t > windowStart);

    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  getRemaining(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = (this.requests.get(key) || []).filter((t) => t > windowStart);

    return Math.max(0, this.maxRequests - timestamps.length);
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
 * Validate request origin
 */
export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true; // Allow requests without origin header
  }

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ];

  return allowedOrigins.some((allowed) => origin === allowed);
}
