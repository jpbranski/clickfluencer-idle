/**
 * Live-Ops Event System - Type Definitions
 * Phase 3: Foundation framework (no active events yet)
 */

export type EventType =
  | "bonus_production"    // Increases generator production
  | "bonus_awards"        // Increases award drop rate
  | "bonus_prestige"      // Prestige multiplier bonus
  | "special_sale"        // Reduced costs for generators/upgrades
  | "limited_time"        // Special unlock or reward
  | "seasonal"            // Holiday/seasonal themed event
  | "challenge";          // Special challenge with rewards

export type EventStatus = "upcoming" | "active" | "ended";

export interface EventReward {
  type: "creds" | "awards" | "prestige" | "achievement" | "theme";
  amount?: number;
  id?: string; // For specific unlocks like theme/achievement IDs
  description: string;
}

export interface EventCondition {
  type: "time_window" | "achievement" | "prestige_level" | "total_creds";
  value: number | string;
  operator?: ">=" | "<=" | "==" | "!=";
}

export interface LiveOpsEvent {
  id: string;
  name: string;
  description: string;
  type: EventType;

  // Timing
  startDate: string; // ISO 8601 format
  endDate: string;   // ISO 8601 format

  // Visual
  banner?: {
    color: string;
    icon: string;
    image?: string;
  };

  // Effects
  effects?: {
    productionMultiplier?: number;  // e.g., 2.0 = 2x production
    awardDropMultiplier?: number;   // e.g., 1.5 = 50% more awards
    prestigeMultiplier?: number;    // e.g., 1.25 = 25% more prestige
    costMultiplier?: number;        // e.g., 0.8 = 20% discount
  };

  // Rewards
  rewards?: EventReward[];

  // Conditions (optional - for gated events)
  conditions?: EventCondition[];

  // UI
  showBanner: boolean;
  priority: number; // Higher = shown first if multiple events active
}

export interface EventState {
  eventId: string;
  status: EventStatus;
  startedAt?: number;
  completedAt?: number;
  rewardsClaimed: string[]; // IDs of claimed rewards
  progressData?: Record<string, number>; // Custom progress tracking
}
