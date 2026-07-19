/**
 * @fileoverview Message list component that renders individual message bubbles
 */

import { useRef, useEffect } from "react";
import { CheckCheck, Copy } from "lucide-react";
import type { ChatMessage } from "@/types";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  onCopy: (content: string, id: string) => void;
  copiedId: string | null;
}

export function ChatMessageList({
  messages,
  isLoading,
  isStreaming,
  onCopy,
  copiedId,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
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
            onCopy={onCopy}
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
  );
}

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
