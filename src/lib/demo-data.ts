/**
 * @fileoverview Demo dataset for FIFA World Cup 2026 StadiumGPT
 * Simulates real-time stadium data for demonstration purposes
 * @module lib/demo-data
 */

import type {
  Stadium,
  CrowdData,
  Incident,
  OperationalMetrics,
  OperationalAlert,
  TransportOption,
  SustainabilityMetrics,
  VolunteerTask,
} from "@/types";

// =============================================================================
// FIFA WORLD CUP 2026 STADIUMS
// =============================================================================

export const DEMO_STADIUMS: Stadium[] = [
  {
    id: "clx1a2b3c4d5e6f7g8h9i0j1",
    name: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    capacity: 82500,
    latitude: 40.8135,
    longitude: -74.0745,
    timezone: "America/New_York",
    gates: [
      { id: "g1", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", name: "Gate A", code: "A", isOpen: true, queueLength: 45, capacity: 500, isAccessible: true },
      { id: "g2", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", name: "Gate B", code: "B", isOpen: true, queueLength: 120, capacity: 500, isAccessible: false },
      { id: "g3", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", name: "Gate C", code: "C", isOpen: true, queueLength: 30, capacity: 500, isAccessible: true },
      { id: "g4", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", name: "Gate D", code: "D", isOpen: false, queueLength: 0, capacity: 500, isAccessible: false },
    ],
    amenities: [
      { id: "a1", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", type: "FOOD_COURT", name: "FIFA Fan Zone Kitchen", level: 1, section: "101-110", isAccessible: true, queueLength: 15, isOpen: true },
      { id: "a2", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", type: "RESTROOM", name: "Accessible Restrooms - Level 1", level: 1, section: "115", isAccessible: true, queueLength: 3, isOpen: true },
      { id: "a3", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", type: "FIRST_AID", name: "Medical Station A", level: 1, section: "100", isAccessible: true, queueLength: 0, isOpen: true },
      { id: "a4", stadiumId: "clx1a2b3c4d5e6f7g8h9i0j1", type: "INFORMATION", name: "Fan Information Center", level: 1, section: "Main Concourse", isAccessible: true, queueLength: 5, isOpen: true },
    ],
  },
  {
    id: "clx2b3c4d5e6f7g8h9i0j1k2",
    name: "SoFi Stadium",
    city: "Inglewood",
    country: "USA",
    capacity: 70240,
    latitude: 33.9535,
    longitude: -118.3392,
    timezone: "America/Los_Angeles",
    gates: [
      { id: "g5", stadiumId: "clx2b3c4d5e6f7g8h9i0j1k2", name: "Gate 1", code: "1", isOpen: true, queueLength: 80, capacity: 600, isAccessible: true },
      { id: "g6", stadiumId: "clx2b3c4d5e6f7g8h9i0j1k2", name: "Gate 2", code: "2", isOpen: true, queueLength: 200, capacity: 600, isAccessible: false },
    ],
    amenities: [],
  },
  {
    id: "clx3c4d5e6f7g8h9i0j1k2l3",
    name: "AT&T Stadium",
    city: "Arlington",
    country: "USA",
    capacity: 80000,
    latitude: 32.7481,
    longitude: -97.0929,
    timezone: "America/Chicago",
    gates: [],
    amenities: [],
  },
];

export const ACTIVE_STADIUM = DEMO_STADIUMS[0] as Stadium;

// =============================================================================
// CROWD DATA
// =============================================================================

export function generateCrowdHotspots() {
  return Array.from({ length: 20 }, (_, _i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    density: Math.random(),
  }));
}

export const DEMO_CROWD_DATA: CrowdData = {
  id: "crowd1",
  stadiumId: ACTIVE_STADIUM.id,
  timestamp: new Date().toISOString(),
  totalCount: 74250,
  density: 0.78,
  hotspots: generateCrowdHotspots(),
  gateData: { A: 8200, B: 15400, C: 12600, D: 0 },
};

// =============================================================================
// INCIDENTS
// =============================================================================

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: "inc1",
    stadiumId: ACTIVE_STADIUM.id,
    type: "CROWD_CONGESTION",
    severity: "HIGH",
    title: "Gate B Overcrowding",
    description: "Gate B experiencing queue buildup exceeding safe capacity. Estimated 120+ fans queued.",
    location: "Gate B - Main Entrance",
    status: "IN_PROGRESS",
    aiSummary: "AI Analysis: Immediate redistribution recommended. Open Gate D or redirect 30% of Gate B queue to Gate C. Estimated resolution: 15 minutes with action.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "inc2",
    stadiumId: ACTIVE_STADIUM.id,
    type: "MEDICAL",
    severity: "MEDIUM",
    title: "Medical Assistance Requested",
    description: "Fan requesting medical assistance near Section 214, Row 12.",
    location: "Section 214 - Row 12",
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "inc3",
    stadiumId: ACTIVE_STADIUM.id,
    type: "INFRASTRUCTURE",
    severity: "LOW",
    title: "Elevator Maintenance - Level 3",
    description: "Elevator #3 on Level 3 undergoing scheduled maintenance. Estimated 45 minutes.",
    location: "Level 3 - Elevator #3",
    status: "OPEN",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// =============================================================================
// OPERATIONAL METRICS
// =============================================================================

export const DEMO_METRICS: OperationalMetrics = {
  totalFans: 74250,
  activeIncidents: 3,
  averageWaitTime: 8,
  crowdDensity: 78,
  gatesOpen: 3,
  totalGates: 4,
  transportCapacity: 85,
  sustainabilityScore: 82,
};

// =============================================================================
// OPERATIONAL ALERTS
// =============================================================================

export const DEMO_ALERTS: OperationalAlert[] = [
  {
    id: "al1",
    type: "CROWD",
    title: "High Density - Gate B",
    message: "Gate B queue has reached 120+ fans. Consider redistributing to Gate A or C.",
    severity: "HIGH",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "al2",
    type: "TRANSPORT",
    title: "Metro Surge Expected",
    message: "Post-match metro surge predicted in 45 minutes. Deploy additional staff to NJ Transit platform.",
    severity: "MEDIUM",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "al3",
    type: "WEATHER",
    title: "Temperature Advisory",
    message: "Temperature reaching 34°C. Recommend activating cooling stations in outdoor concourses.",
    severity: "MEDIUM",
    isRead: true,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "al4",
    type: "SYSTEM",
    title: "AI Systems Nominal",
    message: "All AI subsystems operational. Response latency: 340ms avg.",
    severity: "LOW",
    isRead: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

// =============================================================================
// TRANSPORTATION OPTIONS
// =============================================================================

export const DEMO_TRANSPORT_OPTIONS: TransportOption[] = [
  {
    type: "metro",
    name: "NJ Transit Rail",
    line: "Meadowlands Rail",
    platform: "Platform 1",
    estimatedTime: "12 min walk from stadium",
    frequency: "Every 15 min",
    cost: "$5.25",
    carbonSaving: "4.2 kg CO₂ saved vs. car",
    isEcoFriendly: true,
  },
  {
    type: "shuttle",
    name: "FIFA Official Shuttle",
    line: "Route S1",
    estimatedTime: "Departs every 10 min",
    frequency: "Every 10 min",
    cost: "Free with match ticket",
    carbonSaving: "2.8 kg CO₂ saved vs. car",
    isEcoFriendly: true,
  },
  {
    type: "bus",
    name: "NJ Transit Bus #352",
    line: "Route 352",
    estimatedTime: "20 min to NYC Port Authority",
    frequency: "Every 20 min",
    cost: "$3.50",
    carbonSaving: "3.1 kg CO₂ saved vs. car",
    isEcoFriendly: true,
  },
  {
    type: "walk",
    name: "Walking Route",
    estimatedTime: "35 min to Secaucus Junction",
    isEcoFriendly: true,
    carbonSaving: "Full carbon zero",
  },
];

// =============================================================================
// SUSTAINABILITY METRICS
// =============================================================================

export const DEMO_SUSTAINABILITY: SustainabilityMetrics = {
  carbonSavedKg: 48750,
  ecoTransportUsers: 62400,
  wasteRecycledKg: 12400,
  energySavedKwh: 8900,
  waterSavedLiters: 45000,
  greenScore: 82,
};

// =============================================================================
// VOLUNTEER TASKS
// =============================================================================

export const DEMO_VOLUNTEER_TASKS: VolunteerTask[] = [
  {
    id: "vt1",
    title: "Fan Assistance - Gate A",
    description: "Assist international fans with entry, ticket scanning, and general questions at Gate A.",
    location: "Gate A - Main Entrance",
    priority: "HIGH",
    estimatedDuration: "2 hours",
    requiredSkills: ["Spanish", "English"],
  },
  {
    id: "vt2",
    title: "Accessibility Support - Level 2",
    description: "Escort wheelchair users and fans with disabilities to accessible seating areas on Level 2.",
    location: "Level 2 - Elevator Bank",
    priority: "HIGH",
    estimatedDuration: "3 hours",
    requiredSkills: ["Accessibility", "Patience"],
  },
  {
    id: "vt3",
    title: "Information Booth - Section 100",
    description: "Staff the fan information booth. Answer questions about amenities, schedules, and navigation.",
    location: "Section 100 - Information Kiosk",
    priority: "MEDIUM",
    estimatedDuration: "4 hours",
    requiredSkills: ["French", "English", "Stadium Knowledge"],
  },
];

// =============================================================================
// SAMPLE PROMPTS
// =============================================================================

export const SAMPLE_PROMPTS: Record<string, string[]> = {
  navigation: [
    "How do I reach Gate C from Section 214?",
    "Where is the nearest wheelchair-accessible restroom?",
    "Which food court currently has the shortest queue?",
    "How do I get from the parking lot to my seat in Section 108?",
    "Is there an elevator near Gate A?",
  ],
  crowd: [
    "What are the current crowd congestion hotspots?",
    "Which gates have the longest queues right now?",
    "Predict crowd flow for the post-match exit",
    "Should we open Gate D to manage crowd pressure?",
    "What's the crowd density in the main concourse?",
  ],
  multilingual: [
    "¿Dónde están los baños más cercanos? (Spanish)",
    "Où puis-je trouver de la nourriture halal? (French)",
    "أين مسجد المركز؟ (Arabic)",
    "最寄りの出口はどこですか？ (Japanese)",
    "가장 가까운 의무실은 어디에 있나요? (Korean)",
  ],
  transportation: [
    "What's the best way to get to the stadium from Manhattan?",
    "What time should I leave to avoid post-match traffic?",
    "Are there electric vehicle charging stations nearby?",
    "What's the last metro train after the match?",
    "How do I get from SoFi Stadium to LAX airport?",
  ],
  sustainability: [
    "How much CO₂ did I save by taking the metro?",
    "Where are the recycling stations?",
    "What's the tournament's carbon footprint so far?",
    "How can I reduce my environmental impact at the stadium?",
    "Are there vegan food options to reduce my carbon footprint?",
  ],
  volunteer: [
    "What are my assigned tasks for today?",
    "How do I assist a fan who speaks only Arabic?",
    "There's an incident near Section 214, how should I respond?",
    "Generate a summary of the crowd situation for my supervisor",
    "What are the emergency procedures for a medical situation?",
  ],
  operations: [
    "Generate an AI summary of current stadium status",
    "What are the top 3 operational priorities right now?",
    "Create an incident report for Gate B congestion",
    "How should we allocate staff for the next 2 hours?",
    "What sustainability metrics have we achieved today?",
  ],
};

// =============================================================================
// LANGUAGE CONFIG
// =============================================================================

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", rtl: false, flag: "🇬🇧" },
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false, flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", rtl: false, flag: "🇫🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true, flag: "🇸🇦" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false, flag: "🇮🇳" },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false, flag: "🇧🇷" },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false, flag: "🇯🇵" },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false, flag: "🇩🇪" },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false, flag: "🇰🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false, flag: "🇨🇳" },
] as const;
