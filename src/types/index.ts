/**
 * @fileoverview Global TypeScript type definitions for StadiumGPT
 * @module types/index
 */

// =============================================================================
// ENUMS
// =============================================================================

export type UserRole = "FAN" | "VOLUNTEER" | "STAFF" | "ORGANIZER" | "ADMIN";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentType =
  | "CROWD_CONGESTION"
  | "MEDICAL"
  | "SECURITY"
  | "INFRASTRUCTURE"
  | "WEATHER"
  | "OTHER";

export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type AmenityType =
  | "RESTROOM"
  | "FOOD_COURT"
  | "FIRST_AID"
  | "INFORMATION"
  | "MERCHANDISE"
  | "ATM"
  | "PARKING"
  | "TRANSPORT";

export type SessionType =
  | "NAVIGATION"
  | "CROWD"
  | "MULTILINGUAL"
  | "ACCESSIBILITY"
  | "TRANSPORTATION"
  | "SUSTAINABILITY"
  | "VOLUNTEER"
  | "OPERATIONS"
  | "GENERAL";

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type AlertType =
  | "CROWD"
  | "TRANSPORT"
  | "WEATHER"
  | "INCIDENT"
  | "SYSTEM"
  | "VOLUNTEER";

// =============================================================================
// STADIUM TYPES
// =============================================================================

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude: number;
  longitude: number;
  timezone: string;
  gates?: Gate[];
  sections?: Section[];
  amenities?: Amenity[];
}

export interface Gate {
  id: string;
  stadiumId: string;
  name: string;
  code: string;
  isOpen: boolean;
  queueLength: number;
  capacity: number;
  isAccessible: boolean;
}

export interface Section {
  id: string;
  stadiumId: string;
  name: string;
  level: number;
  isAccessible: boolean;
}

export interface Amenity {
  id: string;
  stadiumId: string;
  type: AmenityType;
  name: string;
  level: number;
  section?: string;
  isAccessible: boolean;
  queueLength: number;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
}

export interface CrowdHotspot {
  x: number;
  y: number;
  density: number;
}

export interface CrowdData {
  id: string;
  stadiumId: string;
  timestamp: string;
  totalCount: number;
  density: number;
  hotspots: CrowdHotspot[];
  gateData: Record<string, number>;
}

export interface Incident {
  id: string;
  stadiumId: string;
  type: IncidentType;
  severity: Severity;
  title: string;
  description: string;
  location: string;
  status: IncidentStatus;
  aiSummary?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// CHAT / AI TYPES
// =============================================================================

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: ChatMessageMetadata;
  tokensUsed?: number;
  responseTime?: number;
  createdAt: string;
}

export interface ChatMessageMetadata {
  featureType?: SessionType;
  language?: string;
  sources?: string[];
  confidence?: number;
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  userId?: string;
  sessionType: SessionType;
  language: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIStreamChunk {
  id: string;
  content: string;
  done: boolean;
}

// =============================================================================
// NAVIGATION TYPES
// =============================================================================

export interface NavigationRoute {
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  steps: NavigationStep[];
  isAccessible: boolean;
  elevatorRequired: boolean;
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  direction: "straight" | "left" | "right" | "up" | "down";
  landmark?: string;
}

// =============================================================================
// TRANSPORT TYPES
// =============================================================================

export interface TransportOption {
  type: "metro" | "bus" | "shuttle" | "walk" | "taxi";
  name: string;
  line?: string;
  platform?: string;
  estimatedTime: string;
  frequency?: string;
  cost?: string;
  carbonSaving?: string;
  isEcoFriendly: boolean;
}

export interface ParkingOption {
  id: string;
  name: string;
  distance: string;
  availableSpots: number;
  totalSpots: number;
  pricePerHour: string;
  isAccessible: boolean;
}

// =============================================================================
// VOLUNTEER TYPES
// =============================================================================

export interface VolunteerProfile {
  id: string;
  userId: string;
  languages: string[];
  skills: string[];
  zone?: string;
  shift?: string;
  isActive: boolean;
  tasksCompleted: number;
}

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: Severity;
  estimatedDuration: string;
  requiredSkills: string[];
  assignedTo?: string;
}

// =============================================================================
// OPERATIONS TYPES
// =============================================================================

export interface OperationalAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: Severity;
  isRead: boolean;
  createdAt: string;
}

export interface OperationalMetrics {
  totalFans: number;
  activeIncidents: number;
  averageWaitTime: number;
  crowdDensity: number;
  gatesOpen: number;
  totalGates: number;
  transportCapacity: number;
  sustainabilityScore: number;
}

// =============================================================================
// USER TYPES
// =============================================================================

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: UserRole;
  language: string;
  accessibilityMode: boolean;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =============================================================================
// SUSTAINABILITY TYPES
// =============================================================================

export interface SustainabilityMetrics {
  carbonSavedKg: number;
  ecoTransportUsers: number;
  wasteRecycledKg: number;
  energySavedKwh: number;
  waterSavedLiters: number;
  greenScore: number;
}

// =============================================================================
// LANGUAGE TYPES
// =============================================================================

export type SupportedLanguage =
  | "en"
  | "es"
  | "fr"
  | "ar"
  | "hi"
  | "pt"
  | "ja"
  | "de"
  | "ko"
  | "zh";

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}
