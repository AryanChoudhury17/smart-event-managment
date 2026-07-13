/**
 * @fileoverview Dashboard sidebar navigation
 * @module components/dashboard/sidebar
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  MapPin,
  Users,
  Globe,
  Accessibility,
  Train,
  Leaf,
  HandHelping,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useUserPreferenceStore } from "@/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Operations overview" },
      { href: "/dashboard/chat", label: "AI Copilot", icon: MessageSquareText, description: "Chat with AI" },
    ],
  },
  {
    group: "AI Modules",
    items: [
      { href: "/dashboard/navigation", label: "Navigation", icon: MapPin, description: "Route assistance" },
      { href: "/dashboard/crowd", label: "Crowd Intel", icon: Users, description: "Crowd management" },
      { href: "/dashboard/multilingual", label: "Multilingual", icon: Globe, description: "Language support" },
      { href: "/dashboard/accessibility", label: "Accessibility", icon: Accessibility, description: "Inclusive access" },
      { href: "/dashboard/transportation", label: "Transport", icon: Train, description: "Transit planning" },
      { href: "/dashboard/sustainability", label: "Sustainability", icon: Leaf, description: "Eco metrics" },
      { href: "/dashboard/volunteer", label: "Volunteers", icon: HandHelping, description: "Team management" },
      { href: "/dashboard/operations", label: "Operations", icon: Zap, description: "Command center" },
    ],
  },
  {
    group: "System",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings, description: "Preferences" },
    ],
  },
] as const;

/**
 * Dashboard sidebar with collapsible navigation
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUserPreferenceStore();

  return (
    <aside
      className="flex flex-col border-r transition-all duration-300 relative shrink-0"
      style={{
        width: sidebarCollapsed ? "60px" : "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderColor: "var(--border-primary)",
      }}
      aria-label="Dashboard navigation"
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 border-b shrink-0"
        style={{
          height: "var(--header-height)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 font-black text-white text-sm"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden="true"
        >
          ⚽
        </div>
        {!sidebarCollapsed && (
          <span
            className="font-black text-lg text-white truncate"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            StadiumGPT
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2" role="navigation">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-4">
            {!sidebarCollapsed && (
              <p
                className="text-xs font-semibold uppercase tracking-wider px-3 mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {group.group}
              </p>
            )}
            <ul role="list" className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-item w-full",
                        isActive && "active",
                        sidebarCollapsed && "justify-center px-2",
                      )}
                      aria-label={sidebarCollapsed ? item.label : undefined}
                      aria-current={isActive ? "page" : undefined}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon
                        size={18}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors hover:bg-blue-600 hover:border-blue-500 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{
          background: "var(--bg-tertiary)",
          borderColor: "var(--border-primary)",
          color: "var(--text-secondary)",
        }}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* FIFA Badge */}
      {!sidebarCollapsed && (
        <div
          className="px-4 py-3 border-t text-center"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            FIFA World Cup 2026
          </p>
          <p className="text-xs font-semibold text-blue-400">Powered by GenAI</p>
        </div>
      )}
    </aside>
  );
}
