/**
 * @fileoverview AI Chat interface — main chat component
 * @module components/chat/chat-interface
 */

"use client";

import { useChat } from "./use-chat";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { ChatSidebar } from "./chat-sidebar";

/**
 * Full-page AI chat interface with streaming support
 */
export function ChatInterface() {
  const {
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
  } = useChat();

  return (
    <div className="flex h-full gap-5">
      {/* Main Chat */}
      <div className="flex flex-col flex-1 glass-card overflow-hidden">
        <ChatHeader
          sessionType={sessionType}
          setSessionType={setSessionType}
          clearMessages={clearMessages}
        />

        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          onCopy={handleCopy}
          copiedId={copiedId}
        />

        {/* Error banner */}
        {error && (
          <div
            className="mx-5 mb-2 px-3 py-2 rounded-lg text-xs text-red-400 border border-red-500/20 bg-red-500/10"
            role="alert"
          >
            {error}
          </div>
        )}

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          isStreaming={isStreaming}
          sessionType={sessionType}
          onAbort={handleAbort}
          inputRef={inputRef}
        />
      </div>

      <ChatSidebar
        sessionType={sessionType}
        language={language}
        onPromptClick={handlePromptClick}
      />
    </div>
  );
}


