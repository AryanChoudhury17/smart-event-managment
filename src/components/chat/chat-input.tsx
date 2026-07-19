/**
 * @fileoverview Chat input component for typing and sending messages
 */

import { useId } from "react";
import { Send, RefreshCw } from "lucide-react";
import type { SessionType } from "@/types";
import { SESSION_TYPES } from "./chat-header";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isStreaming: boolean;
  sessionType: SessionType;
  onAbort: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  isStreaming,
  sessionType,
  onAbort,
  inputRef,
}: ChatInputProps) {
  const inputId = useId();
  const currentSession = SESSION_TYPES.find((s) => s.value === sessionType);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="px-5 pb-5 pt-3 border-t shrink-0"
      style={{ borderColor: "var(--border-primary)" }}
    >
      <div
        className="flex items-end gap-3 rounded-xl border p-3 transition-colors focus-within:border-blue-500/50"
        style={{
          background: "var(--bg-tertiary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Message StadiumGPT AI
        </label>
        <textarea
          id={inputId}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask about ${currentSession?.label.toLowerCase()}...`}
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed max-h-32"
          style={{ color: "var(--text-primary)" }}
          disabled={isLoading || isStreaming}
          aria-label="Type your message"
          aria-multiline="true"
          aria-describedby="input-hint"
        />
        <div className="flex items-center gap-2 shrink-0">
          <span
            id="input-hint"
            className="text-xs hidden md:block"
            style={{ color: "var(--text-muted)" }}
          >
            Enter to send
          </span>
          {isStreaming && (
            <button
              onClick={onAbort}
              className="p-2 rounded-lg transition-colors text-red-400 hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Stop generating"
            >
              <RefreshCw size={16} aria-hidden="true" />
            </button>
          )}
          <button
            onClick={() => onSend()}
            disabled={!input.trim() || isLoading || isStreaming}
            className="p-2 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
            style={{
              background: input.trim() ? "var(--gradient-brand)" : "var(--bg-secondary)",
              color: "white",
            }}
            aria-label="Send message"
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
