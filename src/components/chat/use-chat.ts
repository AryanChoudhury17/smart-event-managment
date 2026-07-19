/**
 * @fileoverview Custom hook for managing chat state and streaming logic
 * @module components/chat/use-chat
 */

"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore, useUserPreferenceStore } from "@/store";
import type { ChatMessage } from "@/types";
import { generateId } from "@/lib/utils";

/**
 * Hook to handle chat messaging, streaming, and associated UI states
 */
export function useChat() {
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

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
    } catch (err: unknown) {
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

  const handleCopy = useCallback(async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handlePromptClick = useCallback((prompt: string) => {
    setInput(prompt);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleAbort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    sessionType,
    isLoading,
    isStreaming,
    error,
    input,
    copiedId,
    language,
    inputRef,
    setInput,
    handleSend,
    handleCopy,
    handlePromptClick,
    handleAbort,
    setSessionType,
    clearMessages,
  };
}
