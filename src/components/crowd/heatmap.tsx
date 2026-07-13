/**
 * @fileoverview Crowd heatmap visualization component
 * @module components/crowd/heatmap
 */

"use client";

import { useMemo } from "react";
import type { CrowdData, Stadium } from "@/types";
import { getDensityColor, formatNumber } from "@/lib/utils";

interface CrowdHeatmapProps {
  data: CrowdData;
  stadium: Stadium;
}

/**
 * Real-time crowd density heatmap for stadium monitoring
 */
export function CrowdHeatmap({ data, stadium }: CrowdHeatmapProps) {
  const gridSize = 10;

  // Build density grid from hotspots
  const densityGrid = useMemo(() => {
    const grid: number[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(0),
    );

    for (const hotspot of data.hotspots) {
      const x = Math.min(Math.floor((hotspot.x / 100) * gridSize), gridSize - 1);
      const y = Math.min(Math.floor((hotspot.y / 100) * gridSize), gridSize - 1);
      const row = grid[y];
      if (row && x < row.length) {
        row[x] = Math.max(row[x] ?? 0, hotspot.density);
      }
    }
    return grid;
  }, [data.hotspots]);

  const overallColor = getDensityColor(data.density);

  return (
    <section
      className="glass-card p-5"
      aria-labelledby="heatmap-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            id="heatmap-title"
            className="text-base font-bold text-white"
          >
            Live Crowd Heatmap
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {stadium.name} · Updated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: overallColor }}
            aria-hidden="true"
          />
          <span
            className="text-sm font-bold"
            style={{ color: overallColor }}
            role="status"
            aria-live="polite"
            aria-label={`Overall crowd density: ${Math.round(data.density * 100)}%`}
          >
            {Math.round(data.density * 100)}% Capacity
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div
        className="relative rounded-xl overflow-hidden mb-4"
        role="img"
        aria-label={`Stadium crowd heatmap showing ${Math.round(data.density * 100)}% overall density. High density areas visible at center and gate areas.`}
        style={{ background: "var(--bg-tertiary)", aspectRatio: "2/1" }}
      >
        {/* Stadium outline overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          <div
            className="w-full h-full grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {densityGrid.flatMap((row, y) =>
              row.map((density, x) => (
                <div
                  key={`${x}-${y}`}
                  className="rounded-sm transition-colors duration-1000"
                  style={{
                    background: density > 0.05 ? getDensityColor(density) : "transparent",
                    opacity: density > 0.05 ? Math.max(0.2, density) : 0.05,
                  }}
                  aria-hidden="true"
                />
              )),
            )}
          </div>
        </div>

        {/* Stadium ring */}
        <div
          className="absolute inset-4 rounded-full border-2 opacity-20"
          style={{ borderColor: "var(--text-secondary)" }}
          aria-hidden="true"
        />

        {/* Center field */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            className="w-12 h-8 rounded-full border opacity-30"
            style={{ borderColor: "var(--text-secondary)" }}
          />
        </div>

        {/* Gate labels */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold opacity-60 text-white" aria-hidden="true">N</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold opacity-60 text-white" aria-hidden="true">S</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold opacity-60 text-white" aria-hidden="true">W</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold opacity-60 text-white" aria-hidden="true">E</div>
      </div>

      {/* Gate breakdown */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Gate Queue Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(data.gateData).map(([gate, count]) => {
            const gateInfo = stadium.gates?.find((g) => g.code === gate);
            const capacity = gateInfo?.capacity ?? 500;
            const density = count / capacity;
            const color = getDensityColor(density);
            return (
              <div
                key={gate}
                className="p-3 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Gate {gate}</span>
                  {gateInfo?.isOpen === false && (
                    <span className="text-xs text-red-400 font-medium">Closed</span>
                  )}
                </div>
                <div
                  className="h-1.5 rounded-full mb-2"
                  style={{ background: "var(--bg-secondary)" }}
                  role="progressbar"
                  aria-valuenow={Math.round(density * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Gate ${gate} queue: ${Math.round(density * 100)}% full`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(density * 100, 100)}%`, background: color }}
                  />
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {formatNumber(count)} in queue
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Density:</span>
        {[
          { label: "Low", color: "hsl(142, 76%, 36%)" },
          { label: "Medium", color: "hsl(43, 100%, 50%)" },
          { label: "High", color: "hsl(25, 95%, 53%)" },
          { label: "Critical", color: "hsl(0, 80%, 50%)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} aria-hidden="true" />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
