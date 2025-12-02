/**
 * useGameLoop.ts - Game Loop Hook
 *
 * Manages the game tick interval and autosave system.
 * This hook should be called once at the app root level.
 */

import { useEffect, useRef } from "react";
import { useGameStore } from "@/state/gameStore";
import { TICK_INTERVAL, AUTOSAVE_INTERVAL } from "@/game/balance";
import { saveGame } from "@/lib/storage";

/**
 * Initialize and manage the game loop
 * Call this once at the top level of your app
 */
export function useGameLoop() {
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Start tick loop
    tickIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        useGameStore.getState().tick();
      }
    }, TICK_INTERVAL);

    // Start autosave loop
    autosaveIntervalRef.current = setInterval(() => {
      if (isMountedRef.current) {
        const state = useGameStore.getState().state;
        saveGame(state).catch((error) => {
          console.error("Autosave failed:", error);
        });
      }
    }, AUTOSAVE_INTERVAL);

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;

      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }

      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
      }
    };
  }, []);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = useGameStore.getState().state;
      // Use synchronous localStorage as a fallback for beforeunload
      try {
        localStorage.setItem("clickfluencer-save", JSON.stringify({
          version: 2,
          state,
          metadata: {
            updatedAt: Date.now(),
          },
        }));
      } catch (error) {
        console.error("Failed to save on unload:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}

/**
 * Hook to manually trigger a save
 * Useful for save buttons, prestige, etc.
 */
export function useSaveGame() {
  return async () => {
    const state = useGameStore.getState().state;
    return saveGame(state);
  };
}
