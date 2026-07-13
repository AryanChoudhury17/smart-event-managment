/**
 * @fileoverview Main landing page / redirect to dashboard
 * @module app/page
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "StadiumGPT — AI Copilot for FIFA World Cup 2026",
  description:
    "Real-Time Generative Intelligence for FIFA World Cup 2026 Stadium Operations",
};

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-slide-in-up">
        {/* FIFA Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/15 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span>⚽</span>
          <span>FIFA World Cup 2026</span>
        </div>

        {/* Logo */}
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            Stadium
          </span>
          <span className="text-white">GPT</span>
        </h1>

        <p className="text-xl md:text-2xl font-semibold text-blue-400 mb-4">
          AI Copilot for FIFA World Cup 2026
        </p>

        <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Real-Time Generative Intelligence for Stadium Operations — empowering fans, organizers,
          volunteers, and staff with AI-driven navigation, crowd management, and operational insights.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="list" aria-label="Key features">
          {[
            "🗺️ AI Navigation",
            "👥 Crowd Intelligence",
            "🌍 10+ Languages",
            "♿ Accessibility",
            "🚇 Transportation",
            "🌱 Sustainability",
            "🙋 Volunteer AI",
            "🖥️ Operations Center",
          ].map((feature) => (
            <span
              key={feature}
              role="listitem"
              className="px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border-primary)",
                color: "var(--text-secondary)",
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            style={{
              background: "var(--gradient-brand)",
              boxShadow: "var(--shadow-glow-blue)",
            }}
          >
            Launch Dashboard
          </Link>
          <Link
            href="/dashboard/chat"
            className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            Try AI Copilot
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "8", label: "AI Modules" },
            { value: "10+", label: "Languages" },
            { value: "48", label: "Host Cities" },
            { value: "3.4M+", label: "Expected Fans" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-xs text-gray-600">
        <p>Built for FIFA World Cup 2026 Challenge · Powered by Generative AI</p>
      </footer>
    </main>
  );
}
