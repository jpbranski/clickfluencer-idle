/**
 * slotStorage.ts - Save Slot Management System
 *
 * Handles multi-slot save system introduced in v1.0.0.
 * Manages 3 save slots and migration from legacy single-save system.
 */

import { save, load, exists, deleteSave, exportSave, importSave } from "./storage";
import { SaveSystemState, SaveSlotState, SAVE_KEYS } from "@/game/types";
import { GameState, createInitialState } from "@/game/state";
import { isLocalStorageAvailable } from "./localStorage";

// ============================================================================
// SAVE SLOT OPERATIONS
// ============================================================================

/**
 * Load the complete save system state
 * Handles migration from legacy save if needed
 */
export async function loadSaveSystem(): Promise<SaveSystemState> {
  try {
    // Try loading new save system first
    const result = await loadFromKey<SaveSystemState>(SAVE_KEYS.SAVE_SYSTEM);
    if (result) {
      return result;
    }

    // Check for legacy save and migrate
    const legacySave = await loadFromKey<GameState>(SAVE_KEYS.LEGACY_SAVE);
    if (legacySave) {
      console.log("Migrating legacy save to Slot 1...");
      return migrateLegacySave(legacySave);
    }

    // No saves found, create fresh save system with Slot 1
    console.log("No saves found, creating new save system...");
    return createFreshSaveSystem();
  } catch (error) {
    console.error("Error loading save system:", error);
    return createFreshSaveSystem();
  }
}

/**
 * Save the complete save system state
 */
export async function saveSaveSystem(saveSystem: SaveSystemState): Promise<void> {
  try {
    await saveToKey(SAVE_KEYS.SAVE_SYSTEM, saveSystem);
  } catch (error) {
    console.error("Error saving save system:", error);
    throw error;
  }
}

/**
 * Load a specific save slot
 */
export function loadSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3
): GameState | null {
  const slot = saveSystem.slots[slotId];
  return slot ? slot.game : null;
}

/**
 * Save game state to a specific slot
 */
export function saveToSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3,
  gameState: GameState
): SaveSystemState {
  const now = Date.now();
  const slot = saveSystem.slots[slotId];

  if (slot) {
    // Update existing slot
    return {
      ...saveSystem,
      slots: {
        ...saveSystem.slots,
        [slotId]: {
          ...slot,
          updatedAt: now,
          game: {
            ...gameState,
            lastSaveTime: now,
          },
        },
      },
    };
  } else {
    // Create new slot
    return {
      ...saveSystem,
      slots: {
        ...saveSystem.slots,
        [slotId]: {
          id: slotId,
          name: `Slot ${slotId}`,
          createdAt: now,
          updatedAt: now,
          game: {
            ...gameState,
            lastSaveTime: now,
          },
        },
      },
    };
  }
}

/**
 * Create a new game in a specific slot
 */
export function createNewSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3,
  name?: string
): SaveSystemState {
  const now = Date.now();
  const freshGame = createInitialState();

  return {
    ...saveSystem,
    activeSlotId: slotId,
    slots: {
      ...saveSystem.slots,
      [slotId]: {
        id: slotId,
        name: name || `Slot ${slotId}`,
        createdAt: now,
        updatedAt: now,
        game: freshGame,
      },
    },
  };
}

/**
 * Delete a specific save slot
 */
export function deleteSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3
): SaveSystemState {
  const newSlots = { ...saveSystem.slots };
  delete newSlots[slotId];

  // If deleting active slot, switch to first available slot or create Slot 1
  let newActiveSlotId = saveSystem.activeSlotId;
  if (slotId === saveSystem.activeSlotId) {
    // Find first available slot
    const availableSlot = ([1, 2, 3] as const).find((id) => newSlots[id] && id !== slotId);
    newActiveSlotId = availableSlot || 1;

    // If no slots remain, create Slot 1
    if (!availableSlot) {
      const now = Date.now();
      newSlots[1] = {
        id: 1,
        name: "Slot 1",
        createdAt: now,
        updatedAt: now,
        game: createInitialState(),
      };
    }
  }

  return {
    ...saveSystem,
    activeSlotId: newActiveSlotId,
    slots: newSlots,
  };
}

/**
 * Switch active slot
 */
export function switchActiveSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3
): SaveSystemState {
  if (!saveSystem.slots[slotId]) {
    console.warn(`Slot ${slotId} does not exist`);
    return saveSystem;
  }

  return {
    ...saveSystem,
    activeSlotId: slotId,
  };
}

/**
 * Rename a save slot
 */
export function renameSlot(
  saveSystem: SaveSystemState,
  slotId: 1 | 2 | 3,
  newName: string
): SaveSystemState {
  const slot = saveSystem.slots[slotId];
  if (!slot) {
    console.warn(`Slot ${slotId} does not exist`);
    return saveSystem;
  }

  return {
    ...saveSystem,
    slots: {
      ...saveSystem.slots,
      [slotId]: {
        ...slot,
        name: newName,
        updatedAt: Date.now(),
      },
    },
  };
}

/**
 * Check if a slot exists
 */
export function slotExists(saveSystem: SaveSystemState, slotId: 1 | 2 | 3): boolean {
  return !!saveSystem.slots[slotId];
}

/**
 * Get slot info for display
 */
export function getSlotInfo(saveSystem: SaveSystemState, slotId: 1 | 2 | 3) {
  const slot = saveSystem.slots[slotId];
  if (!slot) return null;

  const { game } = slot;
  return {
    ...slot,
    followers: game.followers,
    reputation: game.reputation,
    notoriety: game.notoriety.amount,
    prestigeCount: game.stats.prestigeCount,
    totalPlayTime: game.stats.playTime + (Date.now() - game.stats.runStartTime),
  };
}

// ============================================================================
// MIGRATION
// ============================================================================

/**
 * Migrate legacy single-save to Slot 1
 */
function migrateLegacySave(legacyGame: GameState): SaveSystemState {
  const now = Date.now();

  // Ensure legacy save has all new fields with defaults
  const migratedGame: GameState = {
    ...legacyGame,
    // Add notoriety if missing
    notoriety: legacyGame.notoriety || {
      amount: 0,
      basePerSec: 0.0007,
      upkeepRate: 0.02,
      unlocked: true,
    },
    // Add achievements if missing
    achievements: legacyGame.achievements || [],
    // Update version
    version: "v1.0.0",
  };

  const saveSystem: SaveSystemState = {
    activeSlotId: 1,
    slots: {
      1: {
        id: 1,
        name: "Slot 1",
        createdAt: now,
        updatedAt: now,
        game: migratedGame,
      },
    },
    version: "1.0.0",
  };

  // Save migrated system and clean up legacy save
  saveSaveSystem(saveSystem).then(() => {
    console.log("Migration complete. Legacy save migrated to Slot 1.");
    // Note: We keep the legacy save for safety, user can manually delete it
  });

  return saveSystem;
}

/**
 * Create a fresh save system with one empty slot
 */
function createFreshSaveSystem(): SaveSystemState {
  const now = Date.now();
  const freshGame = createInitialState();

  return {
    activeSlotId: 1,
    slots: {
      1: {
        id: 1,
        name: "Slot 1",
        createdAt: now,
        updatedAt: now,
        game: freshGame,
      },
    },
    version: "1.0.0",
  };
}

// ============================================================================
// LOW-LEVEL HELPERS
// ============================================================================

/**
 * Save data with a custom key
 */
async function saveToKey<T>(key: string, data: T): Promise<void> {
  if (!isLocalStorageAvailable()) {
    throw new Error("localStorage is not available");
  }

  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  } catch (error) {
    console.error(`Error saving to key ${key}:`, error);
    throw error;
  }
}

/**
 * Load data from a custom key
 */
async function loadFromKey<T>(key: string): Promise<T | null> {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const json = localStorage.getItem(key);
    if (!json) return null;

    return JSON.parse(json) as T;
  } catch (error) {
    console.error(`Error loading from key ${key}:`, error);
    return null;
  }
}

/**
 * Export save system as JSON string
 */
export function exportSaveSystem(saveSystem: SaveSystemState): string {
  return JSON.stringify(saveSystem, null, 2);
}

/**
 * Import save system from JSON string
 */
export function importSaveSystem(jsonString: string): SaveSystemState {
  try {
    const imported = JSON.parse(jsonString);
    // Validate structure
    if (!imported.activeSlotId || !imported.slots || !imported.version) {
      throw new Error("Invalid save system format");
    }
    return imported as SaveSystemState;
  } catch (error) {
    console.error("Error importing save system:", error);
    throw new Error("Invalid save system JSON");
  }
}
