/**
 * @fileoverview Quick actions panel for dashboard
 * @module components/dashboard/quick-actions
 */

"use client";

import Link from "next/link";
import { SAMPLE_PROMPTS } from "@/lib/demo-data";

const QUICK_ACTIONS = [
  {
    icon: "🗺️",
    label: "Navigate Stadium",
    description: "Get AI-powered directions",
    href: "/dashboard/navigation",
    color: "blue",
  },
  {
    icon: "👥",
    label: "Crowd Analysis",
    description: "View real-time density",
    href: "/dashboard/crowd",
    color: "orange",
  },
  {
    icon: "🌍",
    label: "Translate & Assist",
    description: "Multilingual fan help",
    href: "/dashboard/multilingual",
    color: "purple",
  },
  {
    icon: "♿",
    label: "Accessibility",
    description: "Inclusive routing",
    href: "/dashboard/accessibility",
    color: "green",
  },
  {
    icon: "🚇",
    label: "Transport Intel",
    description: "Transit recommendations",
    href: "/dashboard/transportation",
    color: "cyan",
  },
  {
    icon: "⚡",
    label: "Operations AI",
    description: "Command center",
    href: "/dashboard/operations",
    color: "yellow",
  },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-600/15 text-blue-400 group-hover:bg-blue-600/25",
  orange: "bg-orange-600/15 text-orange-400 group-hover:bg-orange-600/25",
  purple: "bg-purple-600/15 text-purple-400 group-hover:bg-purple-600/25",
  green: "bg-green-600/15 text-green-400 group-hover:bg-green-600/25",
  cyan: "bg-cyan-600/15 text-cyan-400 group-hover:bg-cyan-600/25",
  yellow: "bg-yellow-600/15 text-yellow-400 group-hover:bg-yellow-600/25",
};

/**
 * Quick action cards for navigation to feature modules
 */
export function QuickActions() {
  const suggestions = SAMPLE_PROMPTS["navigation"]?.slice(0, 3) ?? [];

  return (
    <section className="glass-card p-5" aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" className="text-base font-bold text-white mb-4">
        Quick Actions
      </h2>

      {/* Action grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5" role="list">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href as any}
            className="group p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:border-[var(--border-accent)] focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-primary)",
            }}
            role="listitem"
            aria-label={`${action.label}: ${action.description}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base mb-2 transition-colors ${colorMap[action.color] ?? ""}`}
              aria-hidden="true"
            >
              {action.icon}
            </div>
            <p className="text-xs font-semibold text-white mb-0.5">{action.label}</p>
            <p className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Sample prompts */}
      <div>
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Try asking AI...
        </h3>
        <ul className="space-y-2" aria-label="Sample AI prompts">
          {suggestions.map((prompt) => (
            <li key={prompt}>
              <Link
                href={`/dashboard/chat?q=${encodeURIComponent(prompt)}`}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition-colors hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-accent)] focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
                aria-label={`Ask AI: ${prompt}`}
              >
                <span className="text-blue-400" aria-hidden="true">→</span>
                <span className="truncate">{prompt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
