/**
 * gameStore.ts - Zustand Game State Store
 *
 * Central state management for all game data using Zustand.
 * Replaces the old GameEngine pub/sub system with a more React-friendly approach.
 */

import { create } from "zustand";
import { GameState, createInitialState } from "@/game/state";

// ============================================================================
// STORE INTERFACE
// ============================================================================

export interface GameStore {
  /** The complete game state */
  state: GameState;

  /** Update state immutably using an updater function */
  update: (fn: (state: GameState) => GameState) => void;

  /** Replace state entirely (used for loading saves) */
  setState: (state: GameState) => void;

  /** Process a single game tick (called by interval) */
  tick: () => void;

  /** Last time a tick was processed (for delta time calculation) */
  lastTickTime: number;
}

// ============================================================================
// STORE CREATION
// ============================================================================

/**
 * Create the game store
 * This will be called once on app initialization
 */
export const useGameStore = create<GameStore>((set, get) => ({
  state: createInitialState(),
  lastTickTime: Date.now(),

  update: (fn) =>
    set((store) => ({
      state: fn(store.state),
    })),

  setState: (newState) =>
    set({
      state: newState,
      lastTickTime: Date.now(),
    }),

  tick: () => {
    const now = Date.now();
    const { state, lastTickTime } = get();
    const deltaTime = now - lastTickTime;

    // Import engineTick to process game logic
    // NOTE: We import dynamically here to avoid circular deps at the top level
    const { engineTick } = require("@/engine/tick");
    const newState = engineTick(state, deltaTime);

    set({
      state: newState,
      lastTickTime: now,
    });
  },
}));

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Selector hooks for efficient re-renders
 * Only the components that use these specific slices will re-render
 */

export const useGameState = () => useGameStore((state) => state.state);

export const useCredentials = () =>
  useGameStore((state) => ({
    creds: state.state.creds,
    awards: state.state.awards,
    prestige: state.state.prestige,
    notoriety: state.state.notoriety,
  }));

export const useGenerators = () => useGameStore((state) => state.state.generators);

export const useUpgrades = () => useGameStore((state) => state.state.upgrades);

export const useThemes = () => useGameStore((state) => state.state.themes);

export const useStats = () => useGameStore((state) => state.state.stats);

export const useSettings = () => useGameStore((state) => state.state.settings);

export const useAchievements = () => useGameStore((state) => state.state.achievements || []);
