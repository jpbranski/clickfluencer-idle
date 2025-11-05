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
  getCredCacheRate,
  getCredCachePayoutMultiplier,
} from "./state";
import { executePrestige, applyPrestige } from "./prestige";
import {
  getUpgradeById as getNotorietyUpgradeById,
  getUpgradeCost as getNotorietyUpgradeCost,
  canAffordUpgrade as canAffordNotorietyUpgrade,
  applyUpgradeEffect,
  NOTORIETY_UPGRADES,
} from "./upgrades/notorietyUpgrades";
import { NOTORIETY_GENERATORS } from "./generators/notorietyGenerators";
import {
  calculateGeneratorCost,
  canPurchaseGenerator,
  getNotorietyGainPerSecond,
  getTotalUpkeep as getNotorietyUpkeep,
} from "./logic/notorietyLogic";

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
 * Base: 0.3%, each Lucky Charm tier adds +0.3%
 * Max with all 4 tiers: 1.5%
 */
export function getAwardDropRate(state: GameState): number {
  let dropRate = SHARD_DROP_CHANCE;

  // Handle Lucky Charm tiered upgrade
  const luckyCharm = state.upgrades.find((u) => u.id === "lucky_charm");
  if (luckyCharm && luckyCharm.tier && luckyCharm.tier > 0) {
    // Add 0.3% per tier
    dropRate += luckyCharm.effect.value * luckyCharm.tier;
  }

  // Also handle old award drop rate upgrades for backwards compatibility
  state.upgrades
    .filter((u) => u.purchased && u.effect.type === "awardDropRate" && u.id !== "lucky_charm")
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
  credCacheTriggered: boolean;
  credCacheAmount: number;
}

// ============================================================================
// CLICK ACTION
// ============================================================================

/**
 * Execute a manual click
 * - Grants followers based on click power
 * - 0.3%-1.5% chance to drop an award
 * - Small chance to trigger Cred Cache (1-5% of current creds)
 * - Updates statistics
 */
export function clickPost(state: GameState): ClickResult {
  const clickPower = getClickPower(state);
  const eventMultiplier = getClickEventMultiplier(state);
  const followersGained = clickPower * eventMultiplier;

  // Check for award drop (Variable chance based on upgrades)
  const shardDropped = Math.random() < getAwardDropRate(state);

  // Check for Cred Cache drop
  const credCacheRate = getCredCacheRate(state);
  const credCacheTriggered = credCacheRate > 0 && Math.random() < credCacheRate;
  let credCacheAmount = 0;

  if (credCacheTriggered) {
    // Award 1-5% of current total creds
    const percentage = 0.01 + Math.random() * 0.04; // Random between 1% and 5%
    const baseAmount = Math.floor(state.followers * percentage);
    // Apply Notoriety Cache Value boost
    const cacheMultiplier = getCredCachePayoutMultiplier(state);
    credCacheAmount = Math.floor(baseAmount * cacheMultiplier);
  }

  const newState: GameState = {
    ...state,
    followers: state.followers + followersGained + credCacheAmount,
    shards: state.shards + (shardDropped ? 1 : 0),
    stats: {
      ...state.stats,
      totalClicks: state.stats.totalClicks + 1,
      totalFollowersEarned: state.stats.totalFollowersEarned + followersGained + credCacheAmount,
      shardsEarned: state.stats.shardsEarned + (shardDropped ? 1 : 0),
    },
  };

  return {
    success: true,
    state: newState,
    followersGained,
    shardDropped,
    credCacheTriggered,
    credCacheAmount,
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
 * Get the current cost of an upgrade (handles scaling for infinite and tiered upgrades)
 */
export function getUpgradeCost(upgrade: Upgrade): number {
  // Handle tiered upgrades (e.g., better_camera)
  if (upgrade.tier !== undefined && upgrade.costMultiplier !== undefined) {
    const currentTier = upgrade.tier || 0;
    return Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, currentTier));
  }

  // Handle infinite upgrades (e.g., ai_enhancements)
  if (upgrade.costMultiplier && upgrade.currentLevel !== undefined) {
    // Infinite upgrade - cost scales exponentially
    return Math.floor(upgrade.cost * Math.pow(upgrade.costMultiplier, upgrade.currentLevel));
  }

  // Regular one-time upgrades
  return upgrade.cost;
}

/**
 * Purchase an upgrade
 * - One-time purchase that provides permanent bonuses
 * - For infinite upgrades: can be purchased repeatedly with scaling cost
 * - For tiered upgrades: can be purchased up to maxTier times
 * - Deducts followers equal to current cost
 * - Marks upgrade as purchased (or increments level/tier for progressive)
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

  // Check if it's a tiered upgrade
  const isTiered = upgrade.tier !== undefined && upgrade.maxTier !== undefined;
  const currentTier = upgrade.tier || 0;

  // Check if tiered upgrade is maxed out
  if (isTiered && upgrade.maxTier && currentTier >= upgrade.maxTier) {
    return {
      success: false,
      state,
      message: "Already maxed out",
    };
  }

  // Check if it's an infinite upgrade
  const isInfinite = upgrade.maxLevel === undefined || (upgrade.maxLevel && (upgrade.currentLevel || 0) < upgrade.maxLevel);

  // For non-infinite, non-tiered upgrades, check if already purchased
  if (!isInfinite && !isTiered && upgrade.purchased) {
    return {
      success: false,
      state,
      message: "Already purchased",
    };
  }

  const currentCost = getUpgradeCost(upgrade);

  if (!canAfford(state.followers, currentCost)) {
    return {
      success: false,
      state,
      message: "Not enough followers",
    };
  }

  const newUpgrades = state.upgrades.map((u) => {
    if (u.id === upgradeId) {
      // Handle tiered upgrades
      if (u.tier !== undefined && u.maxTier !== undefined) {
        const nextTier = (u.tier || 0) + 1;
        return {
          ...u,
          tier: nextTier,
          purchased: nextTier >= u.maxTier, // mark as purchased when maxed
        };
      }
      // Handle infinite upgrades
      else if (u.currentLevel !== undefined) {
        return { ...u, purchased: true, currentLevel: u.currentLevel + 1 };
      }
      // Handle regular one-time upgrades
      else {
        return { ...u, purchased: true };
      }
    }
    return u;
  });

  const newState: GameState = {
    ...state,
    followers: state.followers - currentCost,
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
 * Activate a theme
 * - Deactivates current theme
 * - Activates selected theme
 * - Theme must be unlocked
 * - Bonus is always active for all unlocked themes (bonuses stack)
 * - Visual theme is applied via useGame hook
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
 * - Generates followers from all generators (minus upkeep)
 * - Generates notoriety from notoriety generators
 * - Unlocks generators based on follower count
 * - Removes expired events
 * - Updates statistics
 */
export function tick(state: GameState, deltaTime: number): GameState {
  const secondsElapsed = deltaTime / 1000;

  // Calculate followers generated this tick
  const followersPerSecond = getFollowersPerSecond(state);

  // Calculate upkeep cost from notoriety generators
  const upkeepPerSecond = getNotorietyUpkeep(state.notorietyGenerators);

  // Net followers after upkeep
  const netFollowersPerSecond = followersPerSecond - upkeepPerSecond;
  const followersGained = netFollowersPerSecond * secondsElapsed;

  // Calculate notoriety gain this tick
  const notorietyPerSecond = getNotorietyGainPerSecond(state.notorietyGenerators);
  const notorietyGained = notorietyPerSecond * secondsElapsed;

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
    notoriety: (state.notoriety || 0) + notorietyGained,
    generators: newGenerators,
    stats: {
      ...state.stats,
      totalFollowersEarned: state.stats.totalFollowersEarned + Math.max(0, followersGained),
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
 * - Spends Creds to gain prestige points
 * - Awards +10% permanent bonus per point
 * - No longer resets progress
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

  const newState = applyPrestige(state, result.reputationGained, result.followersLost);

  return {
    success: true,
    state: newState,
    message: result.message,
  };
}

// ============================================================================
// NOTORIETY ACTIONS
// ============================================================================

/**
 * Purchase a notoriety generator
 * - Deducts followers equal to cost
 * - Increases generator level by 1
 * - Validates that Creds/s remains above 1 after upkeep
 */
export function buyNotorietyGenerator(
  state: GameState,
  generatorId: string,
): ActionResult {
  const generator = NOTORIETY_GENERATORS.find((g) => g.id === generatorId);

  if (!generator) {
    return {
      success: false,
      state,
      message: "Generator not found",
    };
  }

  const currentLevel = state.notorietyGenerators[generatorId as keyof typeof state.notorietyGenerators] || 0;

  if (currentLevel >= generator.maxLevel) {
    return {
      success: false,
      state,
      message: "Max level reached",
    };
  }

  const cost = calculateGeneratorCost(generator, currentLevel);
  const followersPerSecond = getFollowersPerSecond(state);

  if (!canAfford(state.followers, cost)) {
    return {
      success: false,
      state,
      message: "Not enough Creds",
    };
  }

  if (!canPurchaseGenerator(state, generator, state.notorietyGenerators, followersPerSecond)) {
    return {
      success: false,
      state,
      message: "Your Creds/s would drop below 1!",
    };
  }

  const newState: GameState = {
    ...state,
    followers: state.followers - cost,
    notorietyGenerators: {
      ...state.notorietyGenerators,
      [generatorId]: currentLevel + 1,
    },
  };

  return {
    success: true,
    state: newState,
    message: `Purchased ${generator.name}`,
  };
}

/**
 * Purchase a notoriety upgrade
 * - Deducts notoriety equal to cost
 * - Increases upgrade level by 1
 * - Applies upgrade effects
 */
export function buyNotorietyUpgrade(
  state: GameState,
  upgradeId: string,
): ActionResult {
  const upgrade = NOTORIETY_UPGRADES.find((u) => u.id === upgradeId);

  if (!upgrade) {
    return {
      success: false,
      state,
      message: "Upgrade not found",
    };
  }

  const currentLevel = state.notorietyUpgrades[upgradeId] || 0;

  if (currentLevel >= upgrade.cap) {
    return {
      success: false,
      state,
      message: "Max level reached",
    };
  }

  const cost = upgrade.costFormula(currentLevel);

  if (state.notoriety < cost) {
    return {
      success: false,
      state,
      message: "Not enough Notoriety",
    };
  }

  // Handle special instant-effect upgrades like "buy_creds"
  let bonusFollowers = 0;
  if (upgradeId === "buy_creds") {
    const followersPerSecond = getFollowersPerSecond(state);
    bonusFollowers = followersPerSecond * 30 * 60; // 30 minutes worth
  }

  const newState: GameState = {
    ...state,
    notoriety: state.notoriety - cost,
    followers: state.followers + bonusFollowers,
    notorietyUpgrades: {
      ...state.notorietyUpgrades,
      [upgradeId]: currentLevel + 1,
    },
  };

  return {
    success: true,
    state: newState,
    message: `Purchased ${upgrade.name}`,
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
