/**
 * prestige.ts - Prestige ("Reputation") System
 *
 * This module handles the prestige mechanic where players reset their progress
 * in exchange for Reputation points that provide permanent bonuses.
 *
 * Connected to:
 * - state.ts: Reads current state and resets to initial state
 * - actions.ts: Called by prestige action
 * - UI components: Used to show prestige availability and rewards
 *
 * Game Rules:
 * - Prestige threshold: 1 Billion (1e9) Creds (followers)
 * - Reward formula: Math.floor((reach / 1e9) ^ 0.4)
 * - Bonus: +10% to all production per Reputation point
 */

import { GameState, createInitialState, INITIAL_ACHIEVEMENTS } from "./state";
import { PRESTIGE_THRESHOLD, PRESTIGE_BASE_COST } from "./balance";

// ============================================================================
// CONSTANTS
// ============================================================================

export const PRESTIGE_EXPONENT = 0.4;
export const REPUTATION_BONUS_PERCENT = 0.1; // 10% per point

// Export PRESTIGE_THRESHOLD for backward compatibility
export { PRESTIGE_THRESHOLD };

// ============================================================================
// PRESTIGE CALCULATIONS
// ============================================================================

/**
 * Calculate cost to purchase next prestige point
 * Formula: C_p = C_0 × (P+1)^(1/E) = 1e7 × (P+1)^2.5
 *
 * Where P is current prestige level
 *
 * Examples:
 *   P=0 (1st prestige): 1.00e7 Creds
 *   P=1 (2nd prestige): 5.66e7 Creds
 *   P=2 (3rd prestige): 1.33e8 Creds
 *   P=5: 3.96e8 Creds
 *   P=10: 1.78e9 Creds
 */
export function prestigeCost(currentPrestige: number): number {
  return PRESTIGE_BASE_COST * Math.pow(currentPrestige + 1, 1 / PRESTIGE_EXPONENT);
}

/**
 * Check if player can afford prestige (has enough Creds)
 */
export function canPrestige(followers: number, currentPrestige: number): boolean {
  return followers >= prestigeCost(currentPrestige);
}

/**
 * Calculate total production bonus from reputation
 * Formula: (1 + reputation * 0.10)
 *
 * Examples:
 *   0 Reputation => 1.0x (no bonus)
 *   1 Reputation => 1.1x (+10%)
 *   5 Reputation => 1.5x (+50%)
 *   10 Reputation => 2.0x (+100%)
 */
export function calculateReputationBonus(reputation: number): number {
  return 1 + reputation * REPUTATION_BONUS_PERCENT;
}

// ============================================================================
// PRESTIGE EXECUTION
// ============================================================================

export interface PrestigeResult {
  success: boolean;
  reputationGained: number;
  totalReputation: number;
  followersLost: number;
  message: string;
}

/**
 * Execute prestige: spend Creds to gain 1 prestige point
 * Returns result with stats about the prestige
 */
export function executePrestige(state: GameState): PrestigeResult {
  const cost = prestigeCost(state.reputation);

  // Check if can afford prestige
  if (!canPrestige(state.followers, state.reputation)) {
    return {
      success: false,
      reputationGained: 0,
      totalReputation: state.reputation,
      followersLost: 0,
      message: `Need ${cost.toExponential(2)} Creds to prestige`,
    };
  }

  // Prestige costs Creds and grants 1 reputation point
  const reputationGained = 1;
  const followersLost = cost;
  const totalReputation = state.reputation + reputationGained;

  return {
    success: true,
    reputationGained,
    totalReputation,
    followersLost,
    message: `Gained ${reputationGained} Prestige Point!`,
  };
}

/**
 * Reset game state for prestige while preserving certain elements
 *
 * Preserves:
 * - Reputation, shards (prestige currencies)
 * - Themes (cosmetic unlocks)
 * - Infinite scaling upgrades (AI Enhancements, Better Filters)
 * - Achievements (cosmetic)
 * - Settings
 * - Statistics (lifetime)
 *
 * Resets:
 * - Followers (Creds) and Notoriety → 0
 * - Generators → 0 count
 * - Non-infinite upgrades → reset
 * - Notoriety generators → 0
 * - Active events → cleared
 */
export function applyPrestige(
  state: GameState,
  reputationGained: number,
  credCost: number,
): GameState {
  const initial = createInitialState();

  // Identify infinite scaling upgrades to preserve
  const infiniteUpgradeIds = ["ai_enhancements", "better_filters"];

  // Preserve infinite upgrades' progress
  const preservedUpgrades = initial.upgrades.map((upgrade) => {
    if (infiniteUpgradeIds.includes(upgrade.id)) {
      const oldUpgrade = state.upgrades.find((u) => u.id === upgrade.id);
      if (oldUpgrade && oldUpgrade.currentLevel !== undefined) {
        return {
          ...upgrade,
          purchased: false, // 🔧 keep it buyable
          currentLevel: oldUpgrade.currentLevel,
          cost: oldUpgrade.cost,
        };
      }

    }
    return upgrade;
  });

  // Preserve themes, achievements, and settings
  const preservedThemes = state.themes;
  const preservedAchievements = state.achievements;
  const preservedSettings = state.settings;

  // Rebuild fresh notoriety + generator system
  const resetNotorietyGenerators = {
    smm: 0,
    pr_team: 0,
    key_client: 0,
  };

  // Construct clean new state
  const newState: GameState = {
    ...initial,
    reputation: state.reputation + reputationGained,
    followers: 0, // 🔥 Fully reset creds
    notoriety: 0, // 🔥 Fully reset notoriety
    shards: state.shards, // Keep awards
    upgrades: preservedUpgrades,
    themes: preservedThemes,
    achievements: preservedAchievements,
    notorietyGenerators: resetNotorietyGenerators,
    notorietyUpgrades: {}, // Optional: keep or clear
    settings: preservedSettings,
    activeEvents: [],
    stats: {
      ...state.stats,
      prestigeCount: (state.stats.prestigeCount || 0) + 1,
      lastTickTime: Date.now(),
    },
    lastSaveTime: Date.now(),
  };

  return newState;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate effective production multiplier after prestige
 * Shows what your production would be with new reputation
 */
export function getPostPrestigeMultiplier(state: GameState): number {
  const futureReputation = state.reputation + 1;
  return calculateReputationBonus(futureReputation);
}

/**
 * Estimate time to afford next prestige
 * Returns estimated milliseconds, or Infinity if production is too low
 */
export function estimateTimeToPrestige(
  currentFollowers: number,
  currentPrestige: number,
  followersPerSecond: number,
): number {
  const cost = prestigeCost(currentPrestige);
  if (currentFollowers >= cost) return 0;
  if (followersPerSecond <= 0) return Infinity;

  const needed = cost - currentFollowers;
  return (needed / followersPerSecond) * 1000; // Convert to milliseconds
}
