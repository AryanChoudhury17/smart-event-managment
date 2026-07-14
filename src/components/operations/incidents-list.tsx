/**
 * @fileoverview Incidents list component for operations dashboard
 * @module components/operations/incidents-list
 */

import type { Incident } from "@/types";
import { formatRelativeTime, cn, getSeverityClass } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface IncidentsListProps {
  incidents: Incident[];
}

const statusConfig = {
  OPEN: { icon: AlertTriangle, label: "Open", color: "text-yellow-400" },
  IN_PROGRESS: { icon: Clock, label: "In Progress", color: "text-blue-400" },
  RESOLVED: { icon: CheckCircle, label: "Resolved", color: "text-green-400" },
  CLOSED: { icon: XCircle, label: "Closed", color: "text-gray-400" },
};

const typeLabels: Record<string, string> = {
  CROWD_CONGESTION: "Crowd",
  MEDICAL: "Medical",
  SECURITY: "Security",
  INFRASTRUCTURE: "Infrastructure",
  WEATHER: "Weather",
  OTHER: "Other",
};

/**
 * List of active incidents with status and severity indicators
 */
export function IncidentsList({ incidents }: IncidentsListProps) {
  const active = incidents.filter((i) => i.status !== "CLOSED");

  return (
    <section className="glass-card p-5" aria-labelledby="incidents-title">
      <div className="flex items-center justify-between mb-4">
        <h2 id="incidents-title" className="text-base font-bold text-white">
          Active Incidents
        </h2>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          {active.length} active
        </span>
      </div>

      <div className="space-y-3" role="list" aria-label="Active incidents">
        {active.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <CheckCircle size={24} className="text-green-400" aria-hidden="true" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No active incidents
            </p>
          </div>
        ) : (
          active.map((incident) => {
            const StatusIcon = statusConfig[incident.status].icon;
            return (
              <article
                key={incident.id}
                className="p-4 rounded-lg border"
                style={{ background: "var(--bg-tertiary)", borderColor: "var(--border-primary)" }}
                role="listitem"
                aria-label={`${incident.severity} ${typeLabels[incident.type] ?? incident.type} incident: ${incident.title}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded border mt-0.5 shrink-0",
                      getSeverityClass(incident.severity),
                    )}
                    aria-label={`Severity: ${incident.severity}`}
                  >
                    {incident.severity}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {incident.title}
                      </h3>
                      <div
                        className={cn("flex items-center gap-1 shrink-0", statusConfig[incident.status].color)}
                        aria-label={`Status: ${statusConfig[incident.status].label}`}
                      >
                        <StatusIcon size={12} aria-hidden="true" />
                        <span className="text-xs font-medium">
                          {statusConfig[incident.status].label}
                        </span>
                      </div>
                    </div>

                    <p
                      className="text-xs leading-relaxed mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      📍 {incident.location}
                    </p>

                    {incident.aiSummary && (
                      <div
                        className="text-xs p-2 rounded mt-2 border-l-2 border-blue-500/40 leading-relaxed"
                        style={{
                          background: "rgba(59,130,246,0.05)",
                          color: "var(--text-secondary)",
                        }}
                        aria-label="AI analysis and recommendation"
                      >
                        <span className="font-medium text-blue-400">🤖 AI: </span>
                        {incident.aiSummary}
                      </div>
                    )}

                    <time
                      className="text-xs mt-2 block"
                      style={{ color: "var(--text-muted)" }}
                      dateTime={incident.createdAt}
                    >
                      Reported {formatRelativeTime(incident.createdAt)}
                    </time>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
