/**
 * @fileoverview Root layout for the entire application
 * @module app/layout
 */

import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StadiumGPT — AI Copilot for FIFA World Cup 2026",
    template: "%s | StadiumGPT",
  },
  description:
    "Real-Time Generative Intelligence for FIFA World Cup 2026 Stadium Operations. AI-powered navigation, crowd management, multilingual assistance, and operational intelligence.",
  keywords: [
    "FIFA World Cup 2026",
    "Stadium AI",
    "GenAI",
    "Stadium Operations",
    "Crowd Management",
    "Navigation Assistant",
    "Accessibility",
    "Transportation",
  ],
  authors: [{ name: "StadiumGPT Team" }],
  creator: "StadiumGPT",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://stadiumgpt.vercel.app",
    title: "StadiumGPT — AI Copilot for FIFA World Cup 2026",
    description:
      "Real-Time Generative Intelligence for FIFA World Cup 2026 Stadium Operations",
    siteName: "StadiumGPT",
  },
  twitter: {
    card: "summary_large_image",
    title: "StadiumGPT — AI Copilot for FIFA World Cup 2026",
    description:
      "Real-Time Generative Intelligence for FIFA World Cup 2026 Stadium Operations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
    { media: "(prefers-color-scheme: light)", color: "#0d1117" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component — wraps entire application
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* Skip to main content for screen readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
