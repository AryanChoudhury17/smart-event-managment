/**
 * @fileoverview Metric card component for KPI display
 * @module components/dashboard/metric-card
 */

import { cn, getSeverityClass } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  trend?: string;
  trendPositive?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-[var(--border-primary)]",
  success: "border-green-500/20",
  warning: "border-yellow-500/20",
  danger: "border-red-500/20",
};

const iconBgStyles = {
  default: "bg-blue-600/15",
  success: "bg-green-600/15",
  warning: "bg-yellow-600/15",
  danger: "bg-red-600/15",
};

/**
 * Metric card for displaying KPIs in the operations dashboard
 */
export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive,
  variant = "default",
}: MetricCardProps) {
  return (
    <article
      className={cn("glass-card p-5 border transition-all duration-200 hover:scale-[1.02]", variantStyles[variant])}
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          {title}
        </p>
        {icon && (
          <span
            className={cn("text-lg w-8 h-8 flex items-center justify-center rounded-lg", iconBgStyles[variant])}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <p
        className="text-3xl font-black text-white mb-1"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {value}
      </p>

      <div className="flex items-center justify-between mt-2">
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              trendPositive
                ? "text-green-400 bg-green-400/10"
                : "text-yellow-400 bg-yellow-400/10",
            )}
            aria-label={`Trend: ${trend}`}
          >
            {trendPositive && trend !== "LIVE" && trend !== "HIGH" ? "↑ " : ""}
            {trend}
          </span>
        )}
      </div>
    </article>
  );
}
