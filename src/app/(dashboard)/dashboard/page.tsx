/**
 * @fileoverview Main dashboard overview page
 * @module app/(dashboard)/dashboard/page
 */

import type { Metadata } from "next";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CrowdHeatmap } from "@/components/crowd/heatmap";
import { AlertsFeed } from "@/components/operations/alerts-feed";
import { IncidentsList } from "@/components/operations/incidents-list";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StadiumSelector } from "@/components/dashboard/stadium-selector";
import {
  DEMO_METRICS,
  DEMO_ALERTS,
  DEMO_INCIDENTS,
  DEMO_CROWD_DATA,
  ACTIVE_STADIUM,
} from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Operations Dashboard",
  description: "Real-time FIFA World Cup 2026 stadium operations overview",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Real-time intelligence for{" "}
            <span className="text-blue-400 font-medium">{ACTIVE_STADIUM.name}</span>
          </p>
        </div>
        <StadiumSelector />
      </div>

      {/* Key Metrics */}
      <section aria-label="Key operational metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Fans"
            value={DEMO_METRICS.totalFans.toLocaleString()}
            subtitle={`of ${ACTIVE_STADIUM.capacity.toLocaleString()} capacity`}
            icon="👥"
            trend="+2.4%"
            trendPositive
            variant="default"
          />
          <MetricCard
            title="Crowd Density"
            value={`${DEMO_METRICS.crowdDensity}%`}
            subtitle="stadium occupancy"
            icon="📊"
            trend="HIGH"
            variant="warning"
          />
          <MetricCard
            title="Active Incidents"
            value={DEMO_METRICS.activeIncidents.toString()}
            subtitle="requiring attention"
            icon="⚠️"
            trend="LIVE"
            variant="danger"
          />
          <MetricCard
            title="Avg Wait Time"
            value={`${DEMO_METRICS.averageWaitTime} min`}
            subtitle="across all gates"
            icon="⏱️"
            trend="-1.2 min"
            trendPositive
            variant="success"
          />
        </div>
      </section>

      {/* Secondary Metrics */}
      <section aria-label="Secondary metrics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Gates Open"
            value={`${DEMO_METRICS.gatesOpen}/${DEMO_METRICS.totalGates}`}
            subtitle="entry points active"
            icon="🚪"
            variant="default"
          />
          <MetricCard
            title="Transport"
            value={`${DEMO_METRICS.transportCapacity}%`}
            subtitle="capacity in use"
            icon="🚇"
            variant="default"
          />
          <MetricCard
            title="Green Score"
            value={`${DEMO_METRICS.sustainabilityScore}/100`}
            subtitle="sustainability rating"
            icon="🌱"
            trend="+5 pts"
            trendPositive
            variant="success"
          />
          <MetricCard
            title="AI Copilot"
            value="Online"
            subtitle="all systems nominal"
            icon="🤖"
            trend="340ms"
            trendPositive
            variant="success"
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Crowd Heatmap */}
        <div className="xl:col-span-2">
          <CrowdHeatmap data={DEMO_CROWD_DATA} stadium={ACTIVE_STADIUM} />
        </div>

        {/* Alerts Feed */}
        <div>
          <AlertsFeed alerts={DEMO_ALERTS} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <IncidentsList incidents={DEMO_INCIDENTS} />
        <QuickActions />
      </div>
    </div>
  );
}
