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
 *
 * Version 0.4.0 Migration (Phase 2):
 * - Add expanded player metrics to stats
 * - Add new settings fields (masterVolume, reducedMotion, ftueCompleted)
 * - Enhance achievements with category, hidden, tier, unlockedAt
 * - Ensure achievements array is complete
 */

import { storageLogger as logger } from "../logger";
import { ALL_ACHIEVEMENTS } from "@/data/achievements";

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
 * Migrate save data from 0.2.3/0.3.x to 0.4.0 schema (Phase 2)
 *
 * Adds:
 * - Expanded player metrics (sessionCount, highestClickPower, etc.)
 * - New settings (masterVolume, reducedMotion, ftueCompleted)
 * - Enhanced achievements (category, hidden, tier, unlockedAt)
 *
 * @param state - Game state from 0.2.3 or 0.3.x
 * @returns Migrated state with Phase 2 fields
 */
export function migrateTo040(state: any): {
  state: any;
  result: MigrationResult;
} {
  const changes: string[] = [];
  const now = Date.now();

  // Skip if already at v0.4.0
  if (state.version === "v0.4.0") {
    return {
      state,
      result: {
        migrated: false,
        version: "v0.4.0",
        changes: [],
      },
    };
  }

  const migratedState = { ...state };

  // Migrate stats to add new fields
  if (migratedState.stats) {
    const stats = migratedState.stats;

    // Add sessionCount if missing (default to 1 for existing saves)
    if (stats.sessionCount === undefined) {
      stats.sessionCount = 1;
      changes.push("Added stats.sessionCount");
    }

    // Add high-score tracking fields
    if (stats.highestClickPower === undefined) {
      stats.highestClickPower = 0;
      changes.push("Added stats.highestClickPower");
    }
    if (stats.highestCredsPerSecond === undefined) {
      stats.highestCredsPerSecond = 0;
      changes.push("Added stats.highestCredsPerSecond");
    }
    if (stats.highestCredsOwned === undefined) {
      stats.highestCredsOwned = migratedState.creds || 0;
      changes.push("Added stats.highestCredsOwned");
    }
    if (stats.highestAwardsOwned === undefined) {
      stats.highestAwardsOwned = migratedState.awards || 0;
      changes.push("Added stats.highestAwardsOwned");
    }
    if (stats.highestPrestigeOwned === undefined) {
      stats.highestPrestigeOwned = migratedState.prestige || 0;
      changes.push("Added stats.highestPrestigeOwned");
    }
    if (stats.highestNotorietyOwned === undefined) {
      stats.highestNotorietyOwned = migratedState.notoriety || 0;
      changes.push("Added stats.highestNotorietyOwned");
    }

    // Add playtime tracking fields
    if (stats.totalActivePlayTime === undefined) {
      stats.totalActivePlayTime = 0;
      changes.push("Added stats.totalActivePlayTime");
    }
    if (stats.totalAfkTime === undefined) {
      stats.totalAfkTime = 0;
      changes.push("Added stats.totalAfkTime");
    }

    // Add first/last play date
    if (stats.firstPlayDate === undefined) {
      // Use lastSaveTime as approximation if available
      stats.firstPlayDate = migratedState.lastSaveTime || now;
      changes.push("Added stats.firstPlayDate");
    }
    if (stats.lastPlayDate === undefined) {
      stats.lastPlayDate = migratedState.lastSaveTime || now;
      changes.push("Added stats.lastPlayDate");
    }
  }

  // Migrate settings to add new fields
  if (migratedState.settings) {
    const settings = migratedState.settings;

    if (settings.masterVolume === undefined) {
      settings.masterVolume = 0.7; // Default 70% volume
      changes.push("Added settings.masterVolume");
    }
    if (settings.reducedMotion === undefined) {
      settings.reducedMotion = false;
      changes.push("Added settings.reducedMotion");
    }
    if (settings.ftueCompleted === undefined) {
      // Existing players should skip FTUE
      settings.ftueCompleted = true;
      changes.push("Added settings.ftueCompleted (true for existing saves)");
    }
  }

  // Migrate achievements to new structure
  if (migratedState.achievements) {
    const oldAchievements = migratedState.achievements;
    const newAchievements = ALL_ACHIEVEMENTS.map((def) => {
      // Find existing achievement by ID
      const existing = oldAchievements.find((a: any) => a.id === def.id);

      if (existing) {
        // Preserve unlock status, add new fields
        return {
          id: def.id,
          name: def.name,
          description: def.description,
          unlocked: existing.unlocked || false,
          icon: def.icon,
          category: def.category,
          hidden: def.hidden,
          tier: def.tier,
          unlockedAt: existing.unlockedAt, // Preserve if exists
        };
      } else {
        // New achievement, not unlocked
        return {
          id: def.id,
          name: def.name,
          description: def.description,
          unlocked: false,
          icon: def.icon,
          category: def.category,
          hidden: def.hidden,
          tier: def.tier,
        };
      }
    });

    migratedState.achievements = newAchievements;
    changes.push(`Migrated achievements to Phase 2 structure (${newAchievements.length} total)`);
  } else {
    // No achievements array - create from scratch
    migratedState.achievements = ALL_ACHIEVEMENTS.map((def) => ({
      id: def.id,
      name: def.name,
      description: def.description,
      unlocked: false,
      icon: def.icon,
      category: def.category,
      hidden: def.hidden,
      tier: def.tier,
    }));
    changes.push(`Created achievements array (${migratedState.achievements.length} total)`);
  }

  // Update version
  migratedState.version = "v0.4.0";

  // Log migration
  if (changes.length > 0) {
    logger.info("Save migrated to v0.4.0 (Phase 2)", {
      changes,
      from: state.version || "pre-0.4.0",
      to: "v0.4.0",
    });
    console.log(`Save migrated to v0.4.0 (${changes.length} changes)`);
  }

  return {
    state: migratedState,
    result: {
      migrated: changes.length > 0,
      version: "v0.4.0",
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
export function autoMigrate<T = any>(state: T): T {
  if (!state || typeof state !== "object") {
    return state;
  }

  // Apply 0.2.3 migration first
  let { state: migrated } = migrateTo023(state as any);

  // Then apply 0.4.0 migration
  const { state: migrated040, result } = migrateTo040(migrated);

  if (result.migrated) {
    logger.info(`Phase 2 migration completed: ${result.changes.join(", ")}`);
  }

  return migrated040 as T;
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
