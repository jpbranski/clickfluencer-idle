/**
 * storage.ts - Storage API Wrapper
 *
 * Wraps the advanced storage system (IndexedDB + localStorage fallback)
 * while maintaining backward compatibility with the original simple API.
 *
 * Features provided by advanced storage:
 * - IndexedDB with localStorage fallback
 * - Checksum verification
 * - Rolling 3-backup system
 * - Corruption detection and recovery
 * - Base64 encoding
 * - Version migration support
 */

import type { GameState } from "@/game/state";
import {
  save,
  load,
  exportSave as advancedExportSave,
  importSave as advancedImportSave,
} from "./storage/storage";
import { storageLogger as logger } from "./logger";

/**
 * Get environment-specific save key
 * Test environment (test.clickfluenceridle.com) uses separate storage
 * Note: This is now handled by the advanced storage system's SAVE_KEY constant
 */
function getSaveKey(): string {
  const baseKey = "clickfluencer-save-v1";

  // Only apply prefix in browser environment
  if (typeof window === "undefined") {
    return baseKey;
  }

  const hostname = window.location.hostname;

  // Use separate storage for test subdomain
  if (hostname === "test.clickfluenceridle.com") {
    return `test_${baseKey}`;
  }

  return baseKey;
}

/**
 * Save game state
 */
export async function saveGame(state: GameState) {
  try {
    const result = await save<GameState>(state);
    if (result.success) {
      logger.debug("Game saved successfully");
      return { success: true as const };
    } else {
      logger.error("Save failed:", result.error);
      return { success: false as const, error: result.error };
    }
  } catch (e) {
    logger.error("saveGame error:", e);
    return { success: false as const, error: String(e) };
  }
}

/**
 * Load game state
 */
export async function loadGame(): Promise<
  | { success: true; data: GameState; restoredFromBackup?: boolean }
  | { success: false; restoredFromBackup?: boolean }
> {
  try {
    const result = await load<GameState>();
    if (result.success && result.data) {
      logger.debug("Game loaded successfully");
      return {
        success: true,
        data: result.data,
        restoredFromBackup: result.restoredFromBackup
      };
    } else {
      logger.debug("No save found");
      return { success: false };
    }
  } catch (e) {
    logger.warn("loadGame corrupted save, clearing:", e);
    return { success: false, restoredFromBackup: false };
  }
}

/**
 * Auto-save game state (debounced saves)
 */
export async function autoSaveGame(state: GameState) {
  try {
    await save<GameState>(state);
    logger.debug("Auto-saved game");
  } catch (e) {
    logger.warn("autoSave failed:", e);
  }
}

/**
 * Export save as JSON string (for manual backup)
 */
export async function exportSave() {
  try {
    const data = await advancedExportSave<GameState>();
    logger.debug("Save exported");
    return data ?? "";
  } catch {
    return "";
  }
}

/**
 * Import save from JSON string (for manual restore)
 */
export async function importSave(json: string) {
  try {
    JSON.parse(json); // sanity check
    const result = await advancedImportSave<GameState>(json);
    if (result.success) {
      logger.info("Save imported successfully");
      return { success: true as const };
    } else {
      logger.error("Import failed:", result.error);
      return { success: false as const, error: result.error };
    }
  } catch (e) {
    logger.error("importSave error:", e);
    return { success: false as const, error: String(e) };
  }
}
