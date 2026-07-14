/**
 * @fileoverview Operational alerts feed component
 * @module components/operations/alerts-feed
 */

"use client";

import { useState } from "react";
import type { OperationalAlert } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Bell, BellOff, ChevronRight } from "lucide-react";

interface AlertsFeedProps {
  alerts: OperationalAlert[];
}

const severityConfig = {
  LOW: {
    badge: "status-low",
    dot: "bg-green-400",
    label: "Low",
  },
  MEDIUM: {
    badge: "status-medium",
    dot: "bg-yellow-400",
    label: "Medium",
  },
  HIGH: {
    badge: "status-high",
    dot: "bg-orange-400",
    label: "High",
  },
  CRITICAL: {
    badge: "status-critical",
    dot: "bg-red-500 animate-pulse",
    label: "Critical",
  },
};

const typeIcons: Record<string, string> = {
  CROWD: "👥",
  TRANSPORT: "🚇",
  WEATHER: "🌡️",
  INCIDENT: "⚠️",
  SYSTEM: "🤖",
  VOLUNTEER: "🙋",
};

/**
 * Real-time operational alerts feed with read/unread state
 */
export function AlertsFeed({ alerts }: AlertsFeedProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section
      className="glass-card p-5 h-full flex flex-col"
      aria-labelledby="alerts-title"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 id="alerts-title" className="text-base font-bold text-white">
          Operational Alerts
        </h2>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
          role="status"
          aria-live="polite"
          aria-label={`${alerts.filter((a) => !a.isRead).length} unread alerts`}
        >
          {alerts.filter((a) => !a.isRead).length} new
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        role="list"
        aria-label="Alerts list"
      >
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <BellOff size={24} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No active alerts
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = severityConfig[alert.severity];
            const isExpanded = expanded === alert.id;

            return (
              <article
                key={alert.id}
                role="listitem"
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 cursor-pointer",
                  !alert.isRead
                    ? "border-[var(--border-accent)] bg-blue-600/5"
                    : "border-[var(--border-primary)]",
                  "hover:bg-[var(--bg-tertiary)]",
                )}
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
                aria-expanded={isExpanded}
                aria-label={`${alert.severity} alert: ${alert.title}. ${alert.isRead ? "Read" : "Unread"}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(isExpanded ? null : alert.id);
                  }
                }}
              >
                <div className="flex items-start gap-2">
                  {/* Severity dot */}
                  <span
                    className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", config.dot)}
                    aria-hidden="true"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span aria-hidden="true" className="text-sm">
                          {typeIcons[alert.type] ?? "📢"}
                        </span>
                        <p
                          className={cn(
                            "text-xs font-semibold truncate",
                            !alert.isRead ? "text-white" : "",
                          )}
                          style={{ color: alert.isRead ? "var(--text-secondary)" : undefined }}
                        >
                          {alert.title}
                        </p>
                      </div>
                      <ChevronRight
                        size={12}
                        className={cn(
                          "shrink-0 transition-transform duration-200",
                          isExpanded ? "rotate-90" : "",
                        )}
                        style={{ color: "var(--text-muted)" }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Expanded message */}
                    {isExpanded && (
                      <p
                        className="text-xs mt-2 leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {alert.message}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-1">
                      <span
                        className={cn("text-xs px-1.5 py-0.5 rounded border", config.badge)}
                      >
                        {config.label}
                      </span>
                      <time
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                        dateTime={alert.createdAt}
                      >
                        {formatRelativeTime(alert.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* View all link */}
      <div className="pt-3 mt-3 border-t" style={{ borderColor: "var(--border-primary)" }}>
        <button
          className="w-full text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 rounded py-1"
          aria-label="View all operational alerts"
        >
          <Bell size={12} aria-hidden="true" />
          View all alerts
        </button>
      </div>
    </section>
  );
}
