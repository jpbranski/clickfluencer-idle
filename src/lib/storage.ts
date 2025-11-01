// src/lib/storage.ts
import type { GameState } from "@/game/state";

const SAVE_KEY = "clickfluencer-save-v1";

export async function saveGame(state: GameState) {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, json);
    console.log("[saveGame] Successfully saved to localStorage");
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
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      console.log("[loadGame] No save found");
      return { success: false };
    }
    const parsed = JSON.parse(raw) as GameState;
    console.log("[loadGame] Successfully loaded save", parsed);
    return { success: true, data: parsed };
  } catch (e) {
    console.warn("[loadGame] corrupted save, clearing", e);
    localStorage.removeItem(SAVE_KEY);
    return { success: false, restoredFromBackup: false };
  }
}

export async function autoSaveGame(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    console.log("[autoSave] Saved at", new Date().toLocaleTimeString());
  } catch (e) {
    console.warn("[autoSave] failed", e);
  }
}

export async function exportSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    console.log("[exportSave] Exporting save");
    return raw ?? "";
  } catch {
    return "";
  }
}

export async function importSave(json: string) {
  try {
    JSON.parse(json); // sanity check
    localStorage.setItem(SAVE_KEY, json);
    console.log("[importSave] Successfully imported save");
    return { success: true as const };
  } catch (e) {
    console.error("[importSave] error", e);
    return { success: false as const, error: String(e) };
  }
}

export function loadGameSync(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (e) {
    console.warn("[loadGameSync] failed", e);
    return null;
  }
}

export async function pushSaveToServer() {
  try {
    const data = loadGameSync();
    if (!data) {
      console.log("[pushSaveToServer] No local save to sync");
      return { success: false };
    }

    const response = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn("[pushSaveToServer] Failed:", error);
      return { success: false, error };
    }

    const result = await response.json();
    console.log("[pushSaveToServer] Success:", result);
    return { success: true, ...result };
  } catch (err) {
    console.warn("[pushSaveToServer] Error:", err);
    return { success: false, error: String(err) };
  }
}

export async function loadFromServer() {
  try {
    const response = await fetch("/api/load");

    if (!response.ok) {
      const error = await response.json();
      console.warn("[loadFromServer] Failed:", error);
      return { success: false, error };
    }

    const result = await response.json();
    if (result.success && result.saveData) {
      console.log("[loadFromServer] Success:", result);
      // Optionally save to localStorage
      localStorage.setItem(SAVE_KEY, JSON.stringify(result.saveData));
      return { success: true, data: result.saveData };
    }

    return { success: false };
  } catch (err) {
    console.warn("[loadFromServer] Error:", err);
    return { success: false, error: String(err) };
  }
}
