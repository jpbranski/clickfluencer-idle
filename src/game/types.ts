/**
 * types.ts - Save Slot System Types
 *
 * Type definitions for the multi-slot save system introduced in v1.0.0
 */

import { GameState } from "./state";

/**
 * Represents a single save slot
 */
export interface SaveSlotState {
  id: 1 | 2 | 3;
  name: string; // "Slot 1", "Slot 2", "Slot 3" (editable later)
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  game: GameState; // The actual game state
}

/**
 * The complete save system state managing all slots
 */
export interface SaveSystemState {
  activeSlotId: 1 | 2 | 3;
  slots: Partial<Record<1 | 2 | 3, SaveSlotState>>;
  version: string; // "1.0.0"
}

/**
 * Storage keys for the save system
 */
export const SAVE_KEYS = {
  /** New multi-slot save system (v1.0.0+) */
  SAVE_SYSTEM: "cfidle:saves",
  /** Legacy single-save key for migration (pre-v1.0.0) */
  LEGACY_SAVE: "game_save",
} as const;
