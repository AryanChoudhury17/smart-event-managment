/**
 * @fileoverview Zustand store for application state management
 * @module store/app-store
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ChatMessage,
  SessionType,
  SupportedLanguage,
  OperationalAlert,
  CrowdData,
  Incident,
  OperationalMetrics,
} from "@/types";

// =============================================================================
// CHAT STORE
// =============================================================================

interface ChatStore {
  messages: ChatMessage[];
  sessionId: string | null;
  sessionType: SessionType;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  setSessionType: (type: SessionType) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  setSessionId: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    (set) => ({
      messages: [],
      sessionId: null,
      sessionType: "GENERAL",
      isLoading: false,
      isStreaming: false,
      error: null,

      setSessionType: (type) => set({ sessionType: type, messages: [], sessionId: null }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === "ASSISTANT") {
            messages[messages.length - 1] = { ...last, content };
          }
          return { messages };
        }),
      setLoading: (isLoading) => set({ isLoading }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setError: (error) => set({ error }),
      setSessionId: (sessionId) => set({ sessionId }),
      clearMessages: () => set({ messages: [], sessionId: null, error: null }),
    }),
    { name: "chat-store" },
  ),
);

// =============================================================================
// USER PREFERENCES STORE
// =============================================================================

interface UserPreferenceStore {
  language: SupportedLanguage;
  accessibilityMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: "normal" | "large" | "xlarge";
  sidebarCollapsed: boolean;

  setLanguage: (lang: SupportedLanguage) => void;
  toggleAccessibilityMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSize: (size: "normal" | "large" | "xlarge") => void;
  toggleSidebar: () => void;
}

export const useUserPreferenceStore = create<UserPreferenceStore>()(
  devtools(
    persist(
      (set) => ({
        language: "en",
        accessibilityMode: false,
        highContrast: false,
        reducedMotion: false,
        fontSize: "normal",
        sidebarCollapsed: false,

        setLanguage: (language) => set({ language }),
        toggleAccessibilityMode: () =>
          set((state) => ({ accessibilityMode: !state.accessibilityMode })),
        toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
        toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
        setFontSize: (fontSize) => set({ fontSize }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      }),
      { name: "user-preferences" },
    ),
    { name: "user-preference-store" },
  ),
);

// =============================================================================
// OPERATIONS STORE
// =============================================================================

interface OperationsStore {
  alerts: OperationalAlert[];
  crowdData: CrowdData | null;
  incidents: Incident[];
  metrics: OperationalMetrics | null;
  lastUpdated: string | null;
  unreadAlertCount: number;

  setAlerts: (alerts: OperationalAlert[]) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  setCrowdData: (data: CrowdData) => void;
  setIncidents: (incidents: Incident[]) => void;
  setMetrics: (metrics: OperationalMetrics) => void;
  addAlert: (alert: OperationalAlert) => void;
}

export const useOperationsStore = create<OperationsStore>()(
  devtools(
    (set, get) => ({
      alerts: [],
      crowdData: null,
      incidents: [],
      metrics: null,
      lastUpdated: null,
      unreadAlertCount: 0,

      setAlerts: (alerts) =>
        set({
          alerts,
          unreadAlertCount: alerts.filter((a) => !a.isRead).length,
          lastUpdated: new Date().toISOString(),
        }),
      markAlertRead: (id) => {
        const alerts = get().alerts.map((a) =>
          a.id === id ? { ...a, isRead: true } : a,
        );
        set({ alerts, unreadAlertCount: alerts.filter((a) => !a.isRead).length });
      },
      markAllAlertsRead: () => {
        const alerts = get().alerts.map((a) => ({ ...a, isRead: true }));
        set({ alerts, unreadAlertCount: 0 });
      },
      setCrowdData: (crowdData) => set({ crowdData, lastUpdated: new Date().toISOString() }),
      setIncidents: (incidents) => set({ incidents }),
      setMetrics: (metrics) => set({ metrics }),
      addAlert: (alert) => {
        const alerts = [alert, ...get().alerts];
        set({ alerts, unreadAlertCount: alerts.filter((a) => !a.isRead).length });
      },
    }),
    { name: "operations-store" },
  ),
);
