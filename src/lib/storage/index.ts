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
  exportSave as exportSaveLegacy,
  importSave as importSaveLegacy,
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
import { loadSaveSystem, saveSaveSystem, saveToSlot, loadSlot } from "./slotStorage";

/**
 * Save game state (typed convenience wrapper)
 * Now uses the slot storage system
 */
export async function saveGame(state: GameState) {
  try {
    // Load the save system to get the active slot
    const saveSystem = await loadSaveSystem();

    // Update the active slot with the new game state
    const updatedSaveSystem = saveToSlot(saveSystem, saveSystem.activeSlotId, state);

    // Save the updated save system
    await saveSaveSystem(updatedSaveSystem);

    return { success: true };
  } catch (error) {
    console.error("Failed to save game:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Load game state (typed convenience wrapper)
 * Now uses the slot storage system
 */
export async function loadGame() {
  try {
    // Load the save system
    const saveSystem = await loadSaveSystem();

    // Load the game state from the active slot
    const gameState = loadSlot(saveSystem, saveSystem.activeSlotId);

    if (gameState) {
      return {
        success: true,
        data: gameState,
      };
    } else {
      return {
        success: false,
        error: "No save data found in active slot",
      };
    }
  } catch (error) {
    console.error("Failed to load game:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
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
 */
let autoSaveTimeout: NodeJS.Timeout | null = null;
const AUTO_SAVE_DELAY = 5000; // 5 seconds

export function autoSaveGame(state: GameState): void {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }

  autoSaveTimeout = setTimeout(async () => {
    try {
      await saveGame(state);
      console.log("Auto-saved game state");
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, AUTO_SAVE_DELAY);
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

/**
 * Export current active slot as JSON string
 */
export async function exportSave(): Promise<string | null> {
  try {
    const saveSystem = await loadSaveSystem();
    const activeSlot = saveSystem.slots[saveSystem.activeSlotId];

    if (!activeSlot) {
      console.error("No active slot found");
      return null;
    }

    return JSON.stringify(activeSlot, null, 2);
  } catch (error) {
    console.error("Failed to export save:", error);
    return null;
  }
}

/**
 * Import save data to current active slot
 */
export async function importSave(jsonString: string) {
  try {
    const importedSlot = JSON.parse(jsonString);

    // Validate that it has the expected structure
    if (!importedSlot.game || !importedSlot.id) {
      throw new Error("Invalid save format");
    }

    // Load the save system
    const saveSystem = await loadSaveSystem();

    // Update the active slot with the imported game state
    const updatedSaveSystem = saveToSlot(
      saveSystem,
      saveSystem.activeSlotId,
      importedSlot.game
    );

    // Save the updated save system
    await saveSaveSystem(updatedSaveSystem);

    return { success: true };
  } catch (error) {
    console.error("Failed to import save:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid save data",
    };
  }
}
