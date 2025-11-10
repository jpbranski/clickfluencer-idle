/**
 * notorietyLogic.ts - Notoriety System Logic
 *
 * This module contains all calculations for the Notoriety system:
 * - Notoriety generation from generators
 * - Upkeep drain on Creds/second
 * - Generator costs
 * - Upgrade costs and effects
 * - Unlock conditions
 */

import { GameState } from "../state";
import {
  NOTORIETY_GENERATORS,
  NOTORIETY_UPGRADES,
  NotorietyGenerator,
  NotorietyUpgrade,
} from "@/data/notoriety";

// ============================================================================
// GENERATOR CALCULATIONS
// ============================================================================

/**
 * Calculate the cost of a notoriety generator at a given level
 */
export function getNotorietyGeneratorCost(
  generator: NotorietyGenerator,
  currentLevel: number,
): number {
  return Math.floor(
    generator.baseCost * Math.pow(generator.costMultiplier, currentLevel),
  );
}

/**
 * Calculate total Notoriety/second from all generators
 */
export function getNotorietyGainPerSecond(state: GameState): number {
  let total = 0;

  for (const gen of NOTORIETY_GENERATORS) {
    const count = state.notorietyGenerators[gen.id] || 0;
    if (count > 0) {
      total += gen.baseNotorietyPerSecond * count;
    }
  }

  // Apply notoriety boost upgrades
  const notorietyBoostLevel = state.notorietyUpgrades?.['notoriety_boost'] || 0;
  if (notorietyBoostLevel > 0) {
    total *= Math.pow(1.01, notorietyBoostLevel); // 1% per level
  }

  return total;
}

/**
 * Calculate total upkeep drain (Creds/second consumed by notoriety generators)
 */
export function getTotalUpkeep(state: GameState): number {
  let total = 0;

  for (const gen of NOTORIETY_GENERATORS) {
    const count = state.notorietyGenerators[gen.id] || 0;
    if (count > 0) {
      total += gen.baseUpkeep * count;
    }
  }

  return total;
}

/**
 * Check if a notoriety generator should be unlocked
 */
export function shouldUnlockNotorietyGenerator(
  generator: NotorietyGenerator,
  creds: number,
): boolean {
  // Unlock at 50% of base cost
  return creds >= generator.baseCost * 0.5;
}

/**
 * Get all notoriety generators with their current unlock status
 */
export function getNotorietyGeneratorsWithStatus(
  state: GameState,
): Array<NotorietyGenerator & { count: number; cost: number; unlocked: boolean }> {
  return NOTORIETY_GENERATORS.map((gen) => {
    const count = state.notorietyGenerators[gen.id] || 0;
    const cost = getNotorietyGeneratorCost(gen, count);
    const unlocked =
      gen.unlocked || shouldUnlockNotorietyGenerator(gen, state.creds);

    return {
      ...gen,
      count,
      cost,
      unlocked,
    };
  });
}

// ============================================================================
// UPGRADE CALCULATIONS
// ============================================================================

/**
 * Calculate the cost of a notoriety upgrade at a given level
 */
export function getNotorietyUpgradeCost(
  upgrade: NotorietyUpgrade,
  currentLevel: number,
): number {
  if (upgrade.costFormula) {
    return upgrade.costFormula(currentLevel);
  }
  return upgrade.baseCost;
}

/**
 * Check if a notoriety upgrade can be purchased
 */
export function canPurchaseNotorietyUpgrade(
  state: GameState,
  upgrade: NotorietyUpgrade,
): boolean {
  const currentLevel = state.notorietyUpgrades[upgrade.id] || 0;

  // Check if at cap
  if (upgrade.cap !== Infinity && currentLevel >= upgrade.cap) {
    return false;
  }

  // Check if can afford
  const cost = getNotorietyUpgradeCost(upgrade, currentLevel);
  return state.notoriety >= cost;
}

/**
 * Get all notoriety upgrades with their current status
 */
export function getNotorietyUpgradesWithStatus(
  state: GameState,
): Array<
  NotorietyUpgrade & {
    level: number;
    cost: number;
    canPurchase: boolean;
    isMaxed: boolean;
    isInfinite: boolean;
  }
> {
  return NOTORIETY_UPGRADES.map((upgrade) => {
    const level = state.notorietyUpgrades[upgrade.id] || 0;
    const cost = getNotorietyUpgradeCost(upgrade, level);
    const isMaxed = upgrade.cap !== Infinity && level >= upgrade.cap;
    const canPurchase = !isMaxed && state.notoriety >= cost;
    const isInfinite = upgrade.cap === Infinity;

    return {
      ...upgrade,
      level,
      cost,
      canPurchase,
      isMaxed,
      isInfinite,
    };
  });
}

// ============================================================================
// UPGRADE EFFECTS
// ============================================================================

/**
 * Calculate the total Cred boost from notoriety upgrades
 * Returns multiplier (e.g., 1.05 = 5% boost)
 */
export function getCredBoostMultiplier(state: GameState): number {
  const credBoostLevel = state.notorietyUpgrades?.['cred_boost'] || 0;
  return Math.pow(1.01, credBoostLevel); // 1% per level
}

/**
 * Calculate the cache value bonus multiplier
 * Increases the amount gained from Cred Cache drops
 */
export function getCacheValueBonus(state: GameState): number {
  const cacheValueLevel = state.notorietyUpgrades?.['cache_value'] || 0;
  return 1 + cacheValueLevel * 0.05; // +5% per level
}

/**
 * Calculate the drama boost (global prestige bonus)
 */
export function getDramaBoostMultiplier(state: GameState): number {
  const dramaBoostLevel = state.notorietyUpgrades?.['drama_boost'] || 0;
  return 1 + dramaBoostLevel * 0.002; // +0.2% per level
}

/**
 * Calculate the influencer endorsement multiplier for prestige gain
 */
export function getInfluencerEndorsementMultiplier(state: GameState): number {
  const endorsementLevel = state.notorietyUpgrades?.['influencer_endorsement'] || 0;
  return 1 + endorsementLevel * 0.1; // +10% per level
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if player has any notoriety generators
 */
export function hasAnyNotorietyGenerators(state: GameState): boolean {
  return (Object.values(state.notorietyGenerators) as number[]).some((count) => count > 0);
}

/**
 * Get total notoriety earned (for statistics)
 */
export function getTotalNotorietyProduction(state: GameState): number {
  let total = 0;
  for (const gen of NOTORIETY_GENERATORS) {
    const count = state.notorietyGenerators[gen.id] || 0;
    total += gen.baseNotorietyPerSecond * count;
  }
  return total;
}
