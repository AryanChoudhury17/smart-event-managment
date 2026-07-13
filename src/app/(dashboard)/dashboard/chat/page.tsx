/**
 * @fileoverview AI Chat interface page — unified AI copilot
 * @module app/(dashboard)/dashboard/chat/page
 */

import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata: Metadata = {
  title: "AI Copilot Chat",
  description: "Chat with StadiumGPT AI Copilot for navigation, crowd intelligence, and more",
};

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-var(--header-height)-3rem)] animate-fade-in">
      <ChatInterface />
    </div>
  );
}
