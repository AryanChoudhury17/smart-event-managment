/**
 * @fileoverview Health check API route
 * @module app/api/health/route
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Health check endpoint for monitoring and deployment verification
 */
export async function GET(): Promise<NextResponse> {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "1.0.0",
    environment: process.env.NODE_ENV,
    services: {
      api: "operational",
      ai: process.env.OPENAI_API_KEY ? "configured" : "demo-mode",
      database: process.env.DATABASE_URL ? "configured" : "not-configured",
    },
    uptime: process.uptime(),
  };

  return NextResponse.json(health, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
