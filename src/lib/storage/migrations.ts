/**
 * migrations.ts - Save Schema Migrations
 *
 * Handles backward-compatible migrations for save file schema changes.
 * Executes automatically before game state hydration.
 *
 * Version 0.2.3 Migration:
 * - followers → creds
 * - shards → awards
 * - reputation → prestige
 * - stats.totalFollowersEarned → stats.totalCredsEarned
 * - stats.shardsEarned → stats.awardsEarned
 */

import { storageLogger as logger } from "../logger";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MigrationResult {
  migrated: boolean;
  version: string;
  changes: string[];
}

// Legacy save format (pre-0.2.3)
interface LegacySaveState {
  followers?: number;
  shards?: number;
  reputation?: number;
  stats?: {
    totalFollowersEarned?: number;
    shardsEarned?: number;
    [key: string]: unknown;
  };
  version?: string;
  [key: string]: unknown; // Allow other properties
}

// Current save format (0.2.3+)
interface CurrentSaveState {
  creds?: number;
  awards?: number;
  prestige?: number;
  stats?: {
    totalCredsEarned?: number;
    awardsEarned?: number;
    [key: string]: unknown;
  };
  version: string;
  [key: string]: unknown;
}

// ============================================================================
// MIGRATION UTILITIES
// ============================================================================

/**
 * Check if save data needs migration to 0.2.3 schema
 */
function needsMigration(state: LegacySaveState): boolean {
  // Check if any legacy keys exist
  const hasLegacyCurrencies = (
    state.followers !== undefined ||
    state.shards !== undefined ||
    state.reputation !== undefined
  );

  // Check if stats has legacy keys
  const hasLegacyStats = (
    state.stats?.totalFollowersEarned !== undefined ||
    state.stats?.shardsEarned !== undefined
  );

  return hasLegacyCurrencies || hasLegacyStats;
}

/**
 * Migrate save data from pre-0.2.3 to 0.2.3 schema
 *
 * @param state - Game state (potentially with legacy keys)
 * @returns Migrated state with new keys and migration result
 */
export function migrateTo023(state: LegacySaveState): {
  state: CurrentSaveState;
  result: MigrationResult;
} {
  const changes: string[] = [];

  // Check if migration is needed
  if (!needsMigration(state)) {
    return {
      state: state as CurrentSaveState,
      result: {
        migrated: false,
        version: state.version || "0.2.3",
        changes: [],
      },
    };
  }

  // Create migrated state (shallow copy to preserve other properties)
  const migratedState: CurrentSaveState = { ...state, version: "0.2.3" };

  // Migrate followers → creds
  if (state.followers !== undefined) {
    migratedState.creds = state.followers;
    delete migratedState.followers;
    changes.push("followers → creds");
  }

  // Migrate shards → awards
  if (state.shards !== undefined) {
    migratedState.awards = state.shards;
    delete migratedState.shards;
    changes.push("shards → awards");
  }

  // Migrate reputation → prestige
  if (state.reputation !== undefined) {
    migratedState.prestige = state.reputation;
    delete migratedState.reputation;
    changes.push("reputation → prestige");
  }

  // Migrate stats properties
  if (state.stats) {
    // Ensure stats object exists in migrated state
    if (!migratedState.stats) {
      migratedState.stats = { ...state.stats };
    }

    // Migrate stats.totalFollowersEarned → stats.totalCredsEarned
    if (state.stats.totalFollowersEarned !== undefined) {
      migratedState.stats.totalCredsEarned = state.stats.totalFollowersEarned;
      delete migratedState.stats.totalFollowersEarned;
      changes.push("stats.totalFollowersEarned → stats.totalCredsEarned");
    }

    // Migrate stats.shardsEarned → stats.awardsEarned
    if (state.stats.shardsEarned !== undefined) {
      migratedState.stats.awardsEarned = state.stats.shardsEarned;
      delete migratedState.stats.shardsEarned;
      changes.push("stats.shardsEarned → stats.awardsEarned");
    }
  }

  // Update version
  migratedState.version = "0.2.3";

  // Log migration
  logger.info("Save migrated to 0.2.3", {
    changes,
    from: state.version || "pre-0.2.3",
    to: "0.2.3",
  });
  console.log("Save migrated to 0.2.3");

  return {
    state: migratedState,
    result: {
      migrated: true,
      version: "0.2.3",
      changes,
    },
  };
}

/**
 * Auto-migrate game state before hydration
 * This is the main entry point called by the game initialization
 *
 * @param state - Raw game state from storage
 * @returns Migrated game state
 */
export function autoMigrate<T extends LegacySaveState>(state: T): T {
  if (!state || typeof state !== "object") {
    return state;
  }

  // Apply 0.2.3 migration
  const { state: migrated, result } = migrateTo023(state);

  if (result.migrated) {
    logger.info(`Migration completed: ${result.changes.join(", ")}`);
  }

  return migrated as T;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Get migration history for a save state
 */
export function getMigrationInfo(state: LegacySaveState): {
  needsMigration: boolean;
  currentVersion: string;
  targetVersion: string;
} {
  return {
    needsMigration: needsMigration(state),
    currentVersion: state.version || "pre-0.2.3",
    targetVersion: "0.2.3",
  };
}
