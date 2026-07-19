/**
 * @fileoverview Chat sidebar component with sample prompts and language info
 */

import { SAMPLE_PROMPTS, SUPPORTED_LANGUAGES } from "@/lib/demo-data";
import type { SessionType } from "@/types";

interface ChatSidebarProps {
  sessionType: SessionType;
  language: string;
  onPromptClick: (prompt: string) => void;
}

export function ChatSidebar({ sessionType, language, onPromptClick }: ChatSidebarProps) {
  const currentSuggestions = SAMPLE_PROMPTS[sessionType.toLowerCase()] ?? SAMPLE_PROMPTS["navigation"] ?? [];

  return (
    <aside
      className="hidden xl:flex flex-col w-64 glass-card p-4 gap-4 overflow-y-auto"
      aria-labelledby="suggestions-title"
    >
      <div>
        <h2
          id="suggestions-title"
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Sample Prompts
        </h2>
        <ul className="space-y-2" aria-label="Suggested questions">
          {currentSuggestions.slice(0, 5).map((prompt) => (
            <li key={prompt}>
              <button
                onClick={() => onPromptClick(prompt)}
                className="w-full text-left text-xs p-2.5 rounded-lg border transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:border-blue-500/30 focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  borderColor: "var(--border-primary)",
                  color: "var(--text-secondary)",
                }}
                aria-label={`Use prompt: ${prompt}`}
              >
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Language indicator */}
      <div
        className="mt-auto p-3 rounded-lg border text-center"
        style={{
          background: "var(--bg-tertiary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Responding in
        </p>
        <p className="text-sm font-semibold text-white">
          {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag}{" "}
          {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name}
        </p>
      </div>
    </aside>
  );
}
