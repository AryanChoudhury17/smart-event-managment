/**
 * @fileoverview Dashboard header with alerts and user menu
 * @module components/dashboard/header
 */

"use client";

import { Bell, Search, Wifi } from "lucide-react";
import { useOperationsStore, useUserPreferenceStore } from "@/store";
import { SUPPORTED_LANGUAGES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

/**
 * Dashboard top header bar
 */
export function DashboardHeader() {
  const { unreadAlertCount, markAllAlertsRead } = useOperationsStore();
  const { language, setLanguage } = useUserPreferenceStore();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <header
      className="shrink-0 flex items-center justify-between px-6 border-b gap-4"
      style={{
        height: "var(--header-height)",
        background: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
      role="banner"
    >
      {/* Left: Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 text-sm"
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-muted)",
            border: "1px solid var(--border-primary)",
          }}
          role="search"
        >
          <Search size={14} aria-hidden="true" />
          <span>Ask AI anything...</span>
          <kbd
            className="ml-auto text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-primary)",
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Live status */}
        <div
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-green-400"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
          role="status"
          aria-label="System status: Live"
        >
          <Wifi size={11} aria-hidden="true" />
          <span>Live</span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <label htmlFor="language-select" className="sr-only">
            Select interface language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="appearance-none text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-secondary)",
            }}
            aria-label="Select language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts bell */}
        <button
          onClick={markAllAlertsRead}
          className="relative p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:ring-2 focus-visible:ring-blue-500"
          style={{ color: "var(--text-secondary)" }}
          aria-label={
            unreadAlertCount > 0
              ? `${unreadAlertCount} unread alerts. Click to mark all as read.`
              : "No unread alerts"
          }
        >
          <Bell size={18} aria-hidden="true" />
          {unreadAlertCount > 0 && (
            <span
              className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ background: "var(--color-fifa-red)", fontSize: "9px" }}
              aria-hidden="true"
            >
              {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white focus-visible:ring-2 focus-visible:ring-blue-500"
          style={{ background: "var(--gradient-brand)" }}
          aria-label="User account menu"
          aria-haspopup="menu"
        >
          {currentLang?.flag ?? "👤"}
        </button>
      </div>
    </header>
  );
}
