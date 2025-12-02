/**
 * saveMigrations.ts - Save File Migration Pipeline
 *
 * Handles migration of saves from old format to new SaveFile schema.
 * This ensures backward compatibility when loading old saves.
 */

import { SaveFile, MigrationFunction, MigrationResult, isLegacySave, wrapLegacySave } from "@/types/save";
import { GameState } from "@/game/state";
import { CURRENT_SAVE_VERSION } from "@/game/balance";
import { storageLogger as logger } from "@/lib/logger";

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Migrate from V1 (legacy wrapped) to V2 (Zustand + rebalance)
 *
 * Changes:
 * - No structural changes to GameState (backward compatible)
 * - Balance changes are applied through game logic, not save migration
 * - Just update version number and metadata
 */
function migrateV1ToV2(save: SaveFile): SaveFile {
  return {
    version: 2,
    state: save.state, // State structure unchanged
    metadata: {
      ...save.metadata,
      updatedAt: Date.now(),
      gameVersion: "v0.5.0", // Zustand + rebalance version
    },
  };
}

// ============================================================================
// MIGRATION REGISTRY
// ============================================================================

/**
 * Map of version numbers to migration functions
 * Each function migrates from version N to N+1
 */
const MIGRATIONS: Record<number, MigrationFunction> = {
  1: migrateV1ToV2,
  // Future migrations:
  // 2: migrateV2ToV3,
  // 3: migrateV3ToV4,
};

// ============================================================================
// MIGRATION ENGINE
// ============================================================================

/**
 * Run migrations on a save file until it reaches the current version
 *
 * @param save - Save file to migrate
 * @returns Migration result with updated save
 */
export function runMigrations(save: SaveFile): MigrationResult {
  const startVersion = save.version || 1;
  let currentSave = save;
  const changes: string[] = [];

  // Apply migrations sequentially
  while (currentSave.version < CURRENT_SAVE_VERSION) {
    const migrationFn = MIGRATIONS[currentSave.version];

    if (!migrationFn) {
      logger.error(`No migration defined for version ${currentSave.version}`);
      break;
    }

    logger.info(`Migrating save from V${currentSave.version} to V${currentSave.version + 1}`);
    currentSave = migrationFn(currentSave);
    changes.push(`V${currentSave.version - 1} → V${currentSave.version}`);
  }

  const migrated = changes.length > 0;

  if (migrated) {
    logger.info(`Migration complete: ${changes.join(", ")}`);
  }

  return {
    migrated,
    fromVersion: startVersion,
    toVersion: currentSave.version,
    changes,
    save: currentSave,
  };
}

/**
 * Load and migrate a raw save object
 * Handles both legacy saves and versioned saves
 *
 * @param rawData - Raw save data (could be legacy or SaveFile)
 * @returns Migrated SaveFile
 */
export function loadAndMigrateSave(rawData: any): SaveFile {
  let saveFile: SaveFile;

  // Check if it's a legacy save (no version field)
  if (isLegacySave(rawData)) {
    logger.info("Detected legacy save, wrapping as V1");
    saveFile = wrapLegacySave(rawData as GameState);
  } else if (rawData.version && rawData.state) {
    // Already a SaveFile
    saveFile = rawData as SaveFile;
  } else {
    // Assume it's a raw GameState without version
    logger.warn("Save format unclear, wrapping as legacy");
    saveFile = wrapLegacySave(rawData as GameState);
  }

  // Run migrations if needed
  if (saveFile.version < CURRENT_SAVE_VERSION) {
    const result = runMigrations(saveFile);
    return result.save;
  }

  return saveFile;
}

/**
 * Prepare a GameState for saving with current version
 *
 * @param state - Current game state
 * @returns SaveFile ready to serialize
 */
export function prepareForSave(state: GameState): SaveFile {
  return {
    version: CURRENT_SAVE_VERSION,
    state,
    metadata: {
      createdAt: state.stats.firstPlayDate || Date.now(),
      updatedAt: Date.now(),
      gameVersion: state.version || "v0.5.0",
    },
  };
}
