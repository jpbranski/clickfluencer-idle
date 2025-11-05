/**
 * notorietyGenerators.ts - Notoriety Generator System
 *
 * Defines generators that produce Notoriety over time and cost upkeep in followers.
 * Notoriety is a prestige-tier meta resource that fuels permanent upgrades.
 */

import { GameState } from "../state";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NotorietyGenerator {
  id: string;
  name: string;
  baseCost: number; // Cost in followers
  growthRate: number; // Exponential cost multiplier
  notorietyPerHour: number; // Notoriety generated per hour
  upkeep: number; // Followers per second upkeep cost
  maxLevel: number; // Maximum purchase level
}

// ============================================================================
// NOTORIETY GENERATORS
// ============================================================================

export const NOTORIETY_GENERATORS: NotorietyGenerator[] = [
  {
    id: "smm",
    name: "Social Media Manager",
    baseCost: 1e5,
    growthRate: 1.8,
    notorietyPerHour: 1,
    upkeep: 5000,
    maxLevel: 10,
  },
  {
    id: "pr_team",
    name: "PR Team",
    baseCost: 1e8,
    growthRate: 2.2,
    notorietyPerHour: 5,
    upkeep: 25000,
    maxLevel: 10,
  },
  {
    id: "key_client",
    name: "Key Client",
    baseCost: 1e10,
    growthRate: 2.5,
    notorietyPerHour: 25,
    upkeep: 250000,
    maxLevel: 10,
  },
];

// ============================================================================
// GENERATOR LOGIC
// ============================================================================

/**
 * Calculate the cost of purchasing a notoriety generator at a given level
 */
export function calculateGeneratorCost(
  generator: NotorietyGenerator,
  level: number
): number {
  return Math.floor(generator.baseCost * Math.pow(generator.growthRate, level));
}

/**
 * Get the total upkeep cost across all notoriety generators
 * Returns followers per second that will be deducted
 */
export function getTotalUpkeep(
  notorietyGenerators: Record<string, number>
): number {
  let totalUpkeep = 0;

  NOTORIETY_GENERATORS.forEach((gen) => {
    const level = notorietyGenerators[gen.id] || 0;
    totalUpkeep += level * gen.upkeep;
  });

  return totalUpkeep;
}

/**
 * Check if the player can purchase a notoriety generator without dropping below 1 follower/s
 * This prevents the player from going into negative production
 */
export function canPurchaseGenerator(
  state: GameState,
  generator: NotorietyGenerator
): boolean {
  const currentLevel = state.notorietyGenerators?.[generator.id] || 0;

  // Check max level
  if (currentLevel >= generator.maxLevel) {
    return false;
  }

  // Check if player can afford it
  const cost = calculateGeneratorCost(generator, currentLevel);
  if (state.followers < cost) {
    return false;
  }

  // Calculate projected upkeep after purchase
  const currentUpkeep = getTotalUpkeep(state.notorietyGenerators || {});
  const projectedUpkeep = currentUpkeep + generator.upkeep;

  // Calculate current followers per second (from existing getFollowersPerSecond)
  const currentFollowersPerSecond = state.followersPerSecond || 0;
  const netFollowersPerSecond = currentFollowersPerSecond - projectedUpkeep;

  // Must maintain at least 1 follower/s after upkeep
  return netFollowersPerSecond >= 1;
}

/**
 * Get the notoriety gain per second from all generators
 */
export function getNotorietyGainPerSecond(
  notorietyGenerators: Record<string, number>,
  notorietyBoostMultiplier: number = 1
): number {
  let totalPerHour = 0;

  NOTORIETY_GENERATORS.forEach((gen) => {
    const level = notorietyGenerators[gen.id] || 0;
    totalPerHour += level * gen.notorietyPerHour;
  });

  // Convert from per-hour to per-second and apply boost multiplier
  return (totalPerHour / 3600) * notorietyBoostMultiplier;
}

/**
 * Get the net followers per second after upkeep
 * This should be used to display the actual production rate to the player
 */
export function getNetFollowersPerSecond(
  baseFollowersPerSecond: number,
  notorietyGenerators: Record<string, number>
): number {
  const upkeep = getTotalUpkeep(notorietyGenerators);
  const net = baseFollowersPerSecond - upkeep;
  return Math.max(net, 0); // Never go negative
}

/**
 * Get a notoriety generator by ID
 */
export function getGeneratorById(id: string): NotorietyGenerator | undefined {
  return NOTORIETY_GENERATORS.find((gen) => gen.id === id);
}
