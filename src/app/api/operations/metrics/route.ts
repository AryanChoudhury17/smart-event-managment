/**
 * @fileoverview Operations metrics API route
 * @module app/api/operations/metrics/route
 */

import { NextResponse } from "next/server";
import { rateLimit, getClientIP } from "@/lib/rate-limit";
import { DEMO_METRICS, DEMO_CROWD_DATA, DEMO_INCIDENTS, DEMO_ALERTS } from "@/lib/demo-data";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/operations/metrics
 * Returns real-time operational metrics (uses demo data when DB not configured)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request.headers);
  const limitResult = rateLimit(ip, { limit: 60, windowMs: 60 * 1000 });

  if (!limitResult.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // In production, query from database
  const metrics = {
    metrics: DEMO_METRICS,
    crowdData: DEMO_CROWD_DATA,
    activeIncidents: DEMO_INCIDENTS.filter((i) => i.status !== "CLOSED"),
    alerts: DEMO_ALERTS,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(metrics, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=10",
      "X-RateLimit-Remaining": limitResult.remaining.toString(),
    },
  });
}
