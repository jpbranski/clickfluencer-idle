/**
 * save.ts - Save File Schema & Types
 *
 * Defines the versioned save file format and migration types.
 * This ensures backward compatibility when the game state structure changes.
 */

import { GameState } from "@/game/state";

// ============================================================================
// SAVE FILE SCHEMA
// ============================================================================

/**
 * Versioned save file wrapper
 * All saves are stored in this format with explicit versioning
 */
export interface SaveFile {
  /** Save schema version (not game version!) */
  version: number;

  /** The actual game state */
  state: GameState;

  /** Metadata about the save */
  metadata?: {
    /** When this save was created */
    createdAt?: number;

    /** When this save was last updated */
    updatedAt?: number;

    /** Game version that created this save (e.g., "v0.4.0") */
    gameVersion?: string;

    /** Player-defined save name (optional) */
    saveName?: string;
  };
}

// ============================================================================
// MIGRATION TYPES
// ============================================================================

/**
 * Migration function signature
 * Takes a save file and returns the migrated version
 */
export type MigrationFunction = (save: SaveFile) => SaveFile;

/**
 * Result of a migration operation
 */
export interface MigrationResult {
  /** Whether any migrations were applied */
  migrated: boolean;

  /** Starting version */
  fromVersion: number;

  /** Ending version */
  toVersion: number;

  /** List of changes made during migration */
  changes: string[];

  /** The migrated save file */
  save: SaveFile;
}

// ============================================================================
// LEGACY SAVE DETECTION
// ============================================================================

/**
 * Check if a raw object is a legacy save (no version field)
 */
export function isLegacySave(data: any): boolean {
  return data && typeof data === "object" && data.version === undefined && (data.creds !== undefined || data.followers !== undefined);
}

/**
 * Wrap a legacy GameState into a SaveFile structure
 */
export function wrapLegacySave(state: GameState): SaveFile {
  return {
    version: 1, // Legacy saves are considered version 1
    state,
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gameVersion: state.version || "v0.4.0",
    },
  };
}
