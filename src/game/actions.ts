/**
 * actions.ts - Core Gameplay Actions
 *
 * This module contains all game actions that mutate state.
 * Each action is a pure function that takes state and returns new state.
 *
 * Connected to:
 * - state.ts: Reads and mutates game state
 * - engine.ts: Called by game loop and user interactions
 * - prestige.ts: Used for prestige action
 * - UI components: Triggered by user interactions
 *
 * Actions:
 * - clickPost: Manual clicking for followers
 * - buyGenerator: Purchase content generators
 * - buyUpgrade: Purchase permanent upgrades
 * - purchaseTheme: Buy cosmetic themes with awards
 * - applyEvent: Activate random events
 * - tick: Process one game tick (passive generation)
 */

import {
  GameState,
  Generator,
  Upgrade,
  Theme,
  RandomEvent,
  getGeneratorCost,
  getClickPower,
  getFollowersPerSecond,
  shouldUnlockGenerator,
  canAfford,
  canAffordShards,
  getClickEventMultiplier,
} from "./state";
import { executePrestige, resetForPrestige } from "./prestige";

// ============================================================================
// CONSTANTS
// ============================================================================

export const SHARD_DROP_CHANCE = 0.003; // 0.3% chance per click (changed from 0.03%)
export const BASE_TICK_RATE = 250; // milliseconds between ticks

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate current award drop rate based on purchased upgrades
 * Base: 0.3%, each Lucky Charm upgrade adds +0.3%
 * Max with all 4 upgrades: 1.5%
 */
export function getAwardDropRate(state: GameState): number {
  let dropRate = SHARD_DROP_CHANCE;

  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "awardDropRate")
    .forEach((u) => {
      dropRate += u.effect.value;
    });

  return dropRate;
}

// ============================================================================
// ACTION RESULTS
// ============================================================================

export interface ActionResult {
  success: boolean;
  state: GameState;
  message?: string;
}

export interface ClickResult extends ActionResult {
  followersGained: number;
  shardDropped: boolean;
}

// ============================================================================
// CLICK ACTION
// ============================================================================

/**
 * Execute a manual click
 * - Grants followers based on click power
 * - 0.3%-1.5% chance to drop an award
 * - Updates statistics
 */
export function clickPost(state: GameState): ClickResult {
  const clickPower = getClickPower(state);
  const eventMultiplier = getClickEventMultiplier(state);
  const followersGained = clickPower * eventMultiplier;

  // Check for award drop (Variable chance based on upgrades)
  const shardDropped = Math.random() < getAwardDropRate(state);

  const newState: GameState = {
    ...state,
    followers: state.followers + followersGained,
    shards: state.shards + (shardDropped ? 1 : 0),
    stats: {
      ...state.stats,
      totalClicks: state.stats.totalClicks + 1,
      totalFollowersEarned: state.stats.totalFollowersEarned + followersGained,
      shardsEarned: state.stats.shardsEarned + (shardDropped ? 1 : 0),
    },
  };

  return {
    success: true,
    state: newState,
    followersGained,
    shardDropped,
  };
}

// ============================================================================
// GENERATOR ACTIONS
// ============================================================================

/**
 * Purchase a generator (content creation system)
 * - Deducts followers equal to cost
 * - Increments generator count
 * - Updates cost for next purchase
 * - Updates statistics
 */
export function buyGenerator(
  state: GameState,
  generatorId: string,
): ActionResult {
  const generator = state.generators.find((g) => g.id === generatorId);

  if (!generator) {
    return {
      success: false,
      state,
      message: "Generator not found",
    };
  }

  if (!generator.unlocked) {
    return {
      success: false,
      state,
      message: "Generator not unlocked yet",
    };
  }

  const cost = getGeneratorCost(generator);

  if (!canAfford(state.followers, cost)) {
    return {
      success: false,
      state,
      message: "Not enough followers",
    };
  }

  // Update generator count and deduct cost
  const newGenerators = state.generators.map((g) =>
    g.id === generatorId ? { ...g, count: g.count + 1 } : g,
  );

  const newState: GameState = {
    ...state,
    followers: state.followers - cost,
    generators: newGenerators,
    stats: {
      ...state.stats,
      totalGeneratorsPurchased: state.stats.totalGeneratorsPurchased + 1,
    },
  };

  return {
    success: true,
    state: newState,
    message: `Purchased ${generator.name}`,
  };
}

/**
 * Buy multiple generators at once
 * Buys as many as affordable up to the specified count
 */
export function buyGeneratorBulk(
  state: GameState,
  generatorId: string,
  count: number,
): ActionResult {
  let currentState = state;
  let purchased = 0;

  for (let i = 0; i < count; i++) {
    const result = buyGenerator(currentState, generatorId);
    if (!result.success) break;
    currentState = result.state;
    purchased++;
  }

  if (purchased === 0) {
    return {
      success: false,
      state,
      message: "Cannot afford any generators",
    };
  }

  const generator = state.generators.find((g) => g.id === generatorId);
  return {
    success: true,
    state: currentState,
    message: `Purchased ${purchased} ${generator?.name}`,
  };
}

// ============================================================================
// UPGRADE ACTIONS
// ============================================================================

/**
 * Purchase an upgrade
 * - One-time purchase that provides permanent bonuses
 * - Deducts followers equal to cost
 * - Marks upgrade as purchased
 */
export function buyUpgrade(state: GameState, upgradeId: string): ActionResult {
  const upgrade = state.upgrades.find((u) => u.id === upgradeId);

  if (!upgrade) {
    return {
      success: false,
      state,
      message: "Upgrade not found",
    };
  }

  if (upgrade.purchased) {
    return {
      success: false,
      state,
      message: "Already purchased",
    };
  }

  if (!canAfford(state.followers, upgrade.cost)) {
    return {
      success: false,
      state,
      message: "Not enough followers",
    };
  }

  const newUpgrades = state.upgrades.map((u) =>
    u.id === upgradeId ? { ...u, purchased: true } : u,
  );

  const newState: GameState = {
    ...state,
    followers: state.followers - upgrade.cost,
    upgrades: newUpgrades,
    stats: {
      ...state.stats,
      totalUpgradesPurchased: state.stats.totalUpgradesPurchased + 1,
    },
  };

  return {
    success: true,
    state: newState,
    message: `Purchased ${upgrade.name}`,
  };
}

// ============================================================================
// THEME ACTIONS
// ============================================================================

/**
 * Purchase a theme with awards
 * - Unlocks the theme for use
 * - Bonus applies immediately and permanently
 */
export function purchaseTheme(state: GameState, themeId: string): ActionResult {
  const theme = state.themes.find((t) => t.id === themeId);

  if (!theme) {
    return {
      success: false,
      state,
      message: "Theme not found",
    };
  }

  if (theme.unlocked) {
    return {
      success: false,
      state,
      message: "Theme already unlocked",
    };
  }

  if (!canAffordShards(state.shards, theme.cost)) {
    return {
      success: false,
      state,
      message: "Not enough awards",
    };
  }

  const newThemes = state.themes.map((t) =>
    t.id === themeId ? { ...t, unlocked: true } : t,
  );

  const newState: GameState = {
    ...state,
    shards: state.shards - theme.cost,
    themes: newThemes,
  };

  return {
    success: true,
    state: newState,
    message: `Unlocked ${theme.name}`,
  };
}

/**
 * Activate a theme (visual only, bonus is always active when unlocked)
 * - Deactivates current theme
 * - Activates selected theme
 * - Theme must be unlocked
 */
export function activateTheme(state: GameState, themeId: string): ActionResult {
  const theme = state.themes.find((t) => t.id === themeId);

  if (!theme) {
    return {
      success: false,
      state,
      message: "Theme not found",
    };
  }

  if (!theme.unlocked) {
    return {
      success: false,
      state,
      message: "Theme not unlocked",
    };
  }

  const newThemes = state.themes.map((t) => ({
    ...t,
    active: t.id === themeId,
  }));

  const newState: GameState = {
    ...state,
    themes: newThemes,
  };

  return {
    success: true,
    state: newState,
    message: `Activated ${theme.name}`,
  };
}

// ============================================================================
// EVENT ACTIONS
// ============================================================================

/**
 * Apply a random event
 * - Adds event to active events
 * - Event expires after duration
 */
export function applyEvent(state: GameState, event: RandomEvent): GameState {
  const eventWithEndTime: RandomEvent = {
    ...event,
    active: true,
    endTime: Date.now() + event.duration,
  };

  return {
    ...state,
    activeEvents: [...state.activeEvents, eventWithEndTime],
  };
}

/**
 * Remove expired events
 * - Checks each active event
 * - Removes events past their endTime
 */
export function removeExpiredEvents(state: GameState): GameState {
  const now = Date.now();
  const activeEvents = state.activeEvents.filter(
    (event) => event.endTime && event.endTime > now,
  );

  return {
    ...state,
    activeEvents,
  };
}

// ============================================================================
// TICK ACTION
// ============================================================================

/**
 * Process one game tick
 * - Generates followers from all generators
 * - Unlocks generators based on follower count
 * - Removes expired events
 * - Updates statistics
 */
export function tick(state: GameState, deltaTime: number): GameState {
  // Calculate followers generated this tick
  const followersPerSecond = getFollowersPerSecond(state);
  const secondsElapsed = deltaTime / 1000;
  const followersGained = followersPerSecond * secondsElapsed;

  // Update generators unlock status
  const newGenerators = state.generators.map((g) => {
    if (shouldUnlockGenerator(g, state.followers)) {
      return { ...g, unlocked: true };
    }
    return g;
  });

  // Remove expired events
  let newState: GameState = {
    ...state,
    followers: state.followers + followersGained,
    generators: newGenerators,
    stats: {
      ...state.stats,
      totalFollowersEarned: state.stats.totalFollowersEarned + followersGained,
      lastTickTime: Date.now(),
    },
  };

  // Clean up expired events
  newState = removeExpiredEvents(newState);

  return newState;
}

// ============================================================================
// PRESTIGE ACTION
// ============================================================================

/**
 * Execute prestige
 * - Resets most progress
 * - Awards reputation based on followers
 * - Preserves certain elements (awards, themes, stats)
 */
export function prestige(state: GameState): ActionResult {
  const result = executePrestige(state);

  if (!result.success) {
    return {
      success: false,
      state,
      message: result.message,
    };
  }

  const newState = resetForPrestige(state, result.reputationGained);

  return {
    success: true,
    state: newState,
    message: result.message,
  };
}

// ============================================================================
// SETTINGS ACTIONS
// ============================================================================

/**
 * Update a setting
 */
export function updateSetting<K extends keyof GameState["settings"]>(
  state: GameState,
  key: K,
  value: GameState["settings"][K],
): GameState {
  return {
    ...state,
    settings: {
      ...state.settings,
      [key]: value,
    },
  };
}
