/**
 * @fileoverview AI Chat interface — main chat component
 * @module components/chat/chat-interface
 */

"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Send, Trash2, Copy, CheckCheck, RefreshCw } from "lucide-react";
import { useChatStore, useUserPreferenceStore } from "@/store";
import type { ChatMessage, SessionType } from "@/types";
import { cn, generateId, formatRelativeTime } from "@/lib/utils";
import { SAMPLE_PROMPTS, SUPPORTED_LANGUAGES } from "@/lib/demo-data";

const SESSION_TYPES: Array<{ value: SessionType; label: string; icon: string }> = [
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

/**
 * Full-page AI chat interface with streaming support
 */
export function ChatInterface() {
  const inputId = useId();
  const {
    messages,
    sessionType,
    isLoading,
    isStreaming,
    error,
    setSessionType,
    addMessage,
    updateLastMessage,
    setLoading,
    setStreaming,
    setError,
    clearMessages,
  } = useChatStore();

  const { language } = useUserPreferenceStore();
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading || isStreaming) return;

    setInput("");
    setError(null);

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      sessionId: "demo",
      role: "USER",
      content,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setLoading(true);

    // Add empty assistant message for streaming
    const assistantMessage: ChatMessage = {
      id: generateId(),
      sessionId: "demo",
      role: "ASSISTANT",
      content: "",
      createdAt: new Date().toISOString(),
    };
    addMessage(assistantMessage);

    // Create abort controller for cancel support
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sessionType,
          language,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to get AI response");
      }

      if (!response.body) throw new Error("No response body");

      setLoading(false);
      setStreaming(true);

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data) as { content?: string };
              if (parsed.content) {
                accumulated += parsed.content;
                updateLastMessage(accumulated);
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        updateLastMessage("[Response cancelled]");
      } else {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        updateLastMessage(`❌ Error: ${message}`);
      }
    } finally {
      setLoading(false);
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, isLoading, isStreaming, sessionType, language, addMessage, updateLastMessage, setLoading, setStreaming, setError]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const currentSuggestions = SAMPLE_PROMPTS[sessionType.toLowerCase()] ?? SAMPLE_PROMPTS["navigation"] ?? [];

  return (
    <div className="flex h-full gap-5">
      {/* Main Chat */}
      <div className="flex flex-col flex-1 glass-card overflow-hidden">
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div>
            <h1 className="text-base font-bold text-white">StadiumGPT AI Copilot</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
              {SESSION_TYPES.find((s) => s.value === sessionType)?.icon}{" "}
              {SESSION_TYPES.find((s) => s.value === sessionType)?.label} Mode
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

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4"
          role="log"
          aria-live="polite"
          aria-label="Conversation messages"
          aria-atomic="false"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              >
                ⚽
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">
                  Welcome to StadiumGPT
                </h2>
                <p className="text-sm max-w-md" style={{ color: "var(--text-secondary)" }}>
                  Your AI Copilot for FIFA World Cup 2026. Ask me anything about navigation,
                  crowd management, transportation, or stadium operations.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isStreaming={isStreaming && index === messages.length - 1 && message.role === "ASSISTANT"}
                onCopy={handleCopy}
                copiedId={copiedId}
              />
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3" role="status" aria-label="AI is thinking">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              >
                ⚽
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-tl-sm"
                style={{ background: "var(--bg-tertiary)" }}
              >
                <div className="typing-indicator" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mx-5 mb-2 px-3 py-2 rounded-lg text-xs text-red-400 border border-red-500/20 bg-red-500/10"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Input Area */}
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
              placeholder={`Ask about ${SESSION_TYPES.find((s) => s.value === sessionType)?.label.toLowerCase()}...`}
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
                  onClick={() => abortRef.current?.abort()}
                  className="p-2 rounded-lg transition-colors text-red-400 hover:bg-red-500/10 focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Stop generating"
                >
                  <RefreshCw size={16} aria-hidden="true" />
                </button>
              )}
              <button
                onClick={() => void handleSend()}
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
      </div>

      {/* Suggestions sidebar */}
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
                  onClick={() => handlePromptClick(prompt)}
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
    </div>
  );
}

// =============================================================================
// MESSAGE BUBBLE SUB-COMPONENT
// =============================================================================

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming: boolean;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
}

function MessageBubble({ message, isStreaming, onCopy, copiedId }: MessageBubbleProps) {
  const isUser = message.role === "USER";

  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-slide-in-up",
        isUser && "flex-row-reverse",
      )}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
        style={{
          background: isUser ? "var(--bg-tertiary)" : "var(--gradient-brand)",
          border: isUser ? "1px solid var(--border-primary)" : "none",
        }}
        aria-hidden="true"
      >
        {isUser ? "👤" : "⚽"}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[75%] group", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-blue-600/20 text-blue-100 border border-blue-500/20"
              : "rounded-tl-sm text-gray-200 border border-[var(--border-primary)]",
          )}
          style={{
            background: isUser ? undefined : "var(--bg-tertiary)",
          }}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {isStreaming && message.content && (
            <span
              className="inline-block w-0.5 h-4 bg-blue-400 ml-1 animate-pulse"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Actions */}
        <div className={cn("flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity", isUser && "flex-row-reverse")}>
          <time
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
            dateTime={message.createdAt}
          >
            {formatRelativeTime(message.createdAt)}
          </time>
          {!isUser && message.content && (
            <button
              onClick={() => void onCopy(message.content, message.id)}
              className="p-1 rounded text-xs transition-colors focus-visible:ring-1 focus-visible:ring-blue-500"
              style={{ color: "var(--text-muted)" }}
              aria-label="Copy message to clipboard"
            >
              {copiedId === message.id ? (
                <CheckCheck size={12} className="text-green-400" aria-hidden="true" />
              ) : (
                <Copy size={12} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
