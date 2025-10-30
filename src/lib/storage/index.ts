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
} from './storage';

// Re-export types
export type {
  SaveData,
  SaveResult,
  LoadResult,
  StorageDriver,
} from './storage';

// Re-export IndexedDB types (for advanced usage)
export type {
  StoredData,
  BackupData,
} from './indexedDb';

// Re-export utility functions for advanced usage
export {
  isIndexedDBAvailable,
  getIndexedDBSize,
  clearIndexedDB,
} from './indexedDb';

export {
  isLocalStorageAvailable,
  getLocalStorageSize,
  clearLocalStorage,
  getRemainingLocalStorageSpace,
} from './localStorage';

// ============================================================================
// CONVENIENCE WRAPPERS
// ============================================================================

import { save, load, deleteSave, exists } from './storage';
import { GameState } from '../../game/state';

/**
 * Save game state (typed convenience wrapper)
 */
export async function saveGame(state: GameState) {
  return save<GameState>(state);
}

/**
 * Load game state (typed convenience wrapper)
 */
export async function loadGame() {
  return load<GameState>();
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
      console.log('Auto-saved game state');
    } catch (error) {
      console.error('Auto-save failed:', error);
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