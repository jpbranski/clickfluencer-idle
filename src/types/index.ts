/**
 * Type definitions for Clickfluencer Idle
 *
 * Centralized type definitions for components and data structures.
 * These types supplement the game state types defined in /game/state.ts
 */

// Re-export game state types for convenience
export type {
  GameState,
  Generator,
  Upgrade,
  Theme,
  RandomEvent,
  Achievement,
  Statistics,
} from "@/game/state";

/**
 * News item structure from news.json
 */
export interface NewsItem {
  text: string;
  link?: string;
}

/**
 * Extended theme interface with display properties for UI components
 */
export interface ThemeWithDisplay {
  id: string;
  name: string;
  displayName: string;
  cost: number;
  unlocked: boolean;
  active: boolean;
  bonusMultiplier: number;
  bonusClickPower?: number;
  description?: string;
  preview?: {
    background: string;
    accent: string;
    foreground: string;
  };
}
