// src/lib/storage.ts
import type { GameState } from "@/game/state";

/**
 * Get environment-specific save key
 * Test environment (test.clickfluenceridle.com) uses separate storage
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

export async function saveGame(state: GameState) {
  try {
    const json = JSON.stringify(state);
    const saveKey = getSaveKey();
    localStorage.setItem(saveKey, json);
    // console.log("[saveGame] Successfully saved to localStorage with key:", saveKey);
    return { success: true as const };
  } catch (e) {
    console.error("[saveGame] error", e);
    return { success: false as const, error: String(e) };
  }
}

export async function loadGame(): Promise<
  | { success: true; data: GameState; restoredFromBackup?: boolean }
  | { success: false; restoredFromBackup?: boolean }
> {
  try {
    const saveKey = getSaveKey();
    const raw = localStorage.getItem(saveKey);
    if (!raw) {
      console.log("[loadGame] No save found with key:", saveKey);
      return { success: false };
    }
    const parsed = JSON.parse(raw) as GameState;
    console.log("[loadGame] Successfully loaded save from key:", saveKey);
    return { success: true, data: parsed };
  } catch (e) {
    console.warn("[loadGame] corrupted save, clearing", e);
    const saveKey = getSaveKey();
    localStorage.removeItem(saveKey);
    return { success: false, restoredFromBackup: false };
  }
}

export async function autoSaveGame(state: GameState) {
  try {
    const saveKey = getSaveKey();
    localStorage.setItem(saveKey, JSON.stringify(state));
    // console.log("[autoSave] Saved at", new Date().toLocaleTimeString(), "with key:", saveKey);
  } catch (e) {
    console.warn("[autoSave] failed", e);
  }
}

export async function exportSave() {
  try {
    const saveKey = getSaveKey();
    const raw = localStorage.getItem(saveKey);
    console.log("[exportSave] Exporting save from key:", saveKey);
    return raw ?? "";
  } catch {
    return "";
  }
}

export async function importSave(json: string) {
  try {
    JSON.parse(json); // sanity check
    const saveKey = getSaveKey();
    localStorage.setItem(saveKey, json);
    console.log("[importSave] Successfully imported save to key:", saveKey);
    return { success: true as const };
  } catch (e) {
    console.error("[importSave] error", e);
    return { success: false as const, error: String(e) };
  }
}
