/**
 * @fileoverview Chat header component with session type selection
 */

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionType } from "@/types";

export const SESSION_TYPES: Array<{ value: SessionType; label: string; icon: string }> = [
  { value: "GENERAL", label: "General", icon: "🤖" },
  { value: "NAVIGATION", label: "Navigation", icon: "🗺️" },
  { value: "CROWD", label: "Crowd Intel", icon: "👥" },
  { value: "MULTILINGUAL", label: "Multilingual", icon: "🌍" },
  { value: "ACCESSIBILITY", label: "Accessibility", icon: "♿" },
  { value: "TRANSPORTATION", label: "Transport", icon: "🚇" },
  { value: "SUSTAINABILITY", label: "Sustainability", icon: "🌱" },
  { value: "VOLUNTEER", label: "Volunteer", icon: "🙋" },
  { value: "OPERATIONS", label: "Operations", icon: "⚡" },
];

interface ChatHeaderProps {
  sessionType: SessionType;
  setSessionType: (type: SessionType) => void;
  clearMessages: () => void;
}

export function ChatHeader({ sessionType, setSessionType, clearMessages }: ChatHeaderProps) {
  const currentSession = SESSION_TYPES.find((s) => s.value === sessionType);

  return (
    <>
      {/* Chat Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div>
          <h1 className="text-base font-bold text-white">StadiumGPT AI Copilot</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
            {currentSession?.icon} {currentSession?.label} Mode
          </p>
        </div>
        <button
          onClick={clearMessages}
          className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-tertiary)] focus-visible:ring-2 focus-visible:ring-blue-500"
          style={{ color: "var(--text-muted)" }}
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Session Type Selector */}
      <div
        className="flex gap-2 px-5 py-3 border-b overflow-x-auto shrink-0"
        style={{ borderColor: "var(--border-primary)" }}
        role="tablist"
        aria-label="AI mode selection"
      >
        {SESSION_TYPES.map((type) => (
          <button
            key={type.value}
            role="tab"
            aria-selected={sessionType === type.value}
            onClick={() => setSessionType(type.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500",
              sessionType === type.value
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "border border-transparent hover:bg-[var(--bg-tertiary)]",
            )}
            style={{
              color: sessionType !== type.value ? "var(--text-secondary)" : undefined,
            }}
          >
            <span aria-hidden="true">{type.icon}</span>
            {type.label}
          </button>
        ))}
      </div>
    </>
  );
}
