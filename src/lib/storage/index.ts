/**
 * storage/index.ts - Unified Storage Interface
 *
 * Exports a clean, unified interface for game storage operations.
 * Abstracts away driver selection and internal implementation details.
 *
 * Usage:
 *   import { saveGame, loadGame, deleteGame } from '@/lib/storage';
 */

// Re-export main storage operations
export {
  save,
  load,
  exists,
  deleteSave,
  exportSave,
  importSave,
  getStorageDriver,
  setStorageDriver,
  SAVE_KEY,
  CURRENT_VERSION,
  MAX_BACKUPS,
} from "./storage";

// Re-export types
export type {
  SaveData,
  SaveResult,
  LoadResult,
  StorageDriver,
} from "./storage";

// Re-export IndexedDB types (for advanced usage)
export type { StoredData, BackupData } from "./indexedDb";

// Re-export utility functions for advanced usage
export {
  isIndexedDBAvailable,
  getIndexedDBSize,
  clearIndexedDB,
} from "./indexedDb";

export {
  isLocalStorageAvailable,
  getLocalStorageSize,
  clearLocalStorage,
  getRemainingLocalStorageSpace,
} from "./localStorage";

// ============================================================================
// CONVENIENCE WRAPPERS
// ============================================================================

import { save, load, deleteSave, exists } from "./storage";
import { GameState } from "../../game/state";
import { SaveFile } from "@/types/save";
import { loadAndMigrateSave, prepareForSave } from "./saveMigrations";

/**
 * Save game state with versioning (typed convenience wrapper)
 * Wraps state in SaveFile format before saving
 */
export async function saveGame(state: GameState) {
  const saveFile = prepareForSave(state);
  return save<SaveFile>(saveFile);
}

/**
 * Load game state with automatic migration (typed convenience wrapper)
 * Unwraps SaveFile and returns GameState
 */
export async function loadGame() {
  const result = await load<any>();

  if (!result.success || !result.data) {
    return result as { success: false; error: string };
  }

  try {
    // Run migrations if needed
    const saveFile = loadAndMigrateSave(result.data);

    return {
      success: true,
      data: saveFile.state,
      restoredFromBackup: result.restoredFromBackup,
    };
  } catch (error) {
    return {
      success: false,
      error: `Migration failed: ${error}`,
    };
  }
}

/**
 * Delete game save (convenience wrapper)
 */
export async function deleteGame() {
  return deleteSave();
}

/**
 * Check if game save exists (convenience wrapper)
 */
export async function gameExists() {
  return exists();
}

/**
 * Auto-save game state
 * Debounced wrapper for frequent save calls
 * Updated to use new balance constant
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;
import { DEBOUNCE_SAVE_DELAY } from "@/game/balance";

export function autoSaveGame(state: GameState): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(async () => {
    try {
      await saveGame(state);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, DEBOUNCE_SAVE_DELAY);
}

/**
 * Force immediate save (bypasses auto-save delay)
 */
export async function forceSaveGame(state: GameState) {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = null;
  }

  return saveGame(state);
}
