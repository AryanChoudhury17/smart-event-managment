"use client";

import { DEMO_STADIUMS } from "@/lib/demo-data";

export function StadiumSelector() {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="stadium-select" className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        Stadium:
      </label>
      <select
        id="stadium-select"
        className="text-sm font-medium px-3 py-1.5 rounded-lg border focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        style={{
          background: "var(--bg-tertiary)",
          borderColor: "var(--border-primary)",
          color: "var(--text-primary)",
        }}
        defaultValue={DEMO_STADIUMS[0]?.id}
        aria-label="Select stadium"
      >
        {DEMO_STADIUMS.map((stadium) => (
          <option key={stadium.id} value={stadium.id}>
            {stadium.name} — {stadium.city}
          </option>
        ))}
      </select>
    </div>
  );
}
