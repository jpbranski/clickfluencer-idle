/**
 * notorietyLogic.ts - Notoriety System Logic
 *
 * Handles all calculations related to the notoriety system:
 * - Generator costs
 * - Upkeep calculations
 * - Purchase validation
 * - Notoriety gain rates
 */

import { NotorietyGenerator } from "../generators/notorietyGenerators";
import { GameState } from "../state";

export interface NotorietyState {
  smm: number;
  pr_team: number;
  key_client: number;
}

/**
 * Calculate the cost to purchase a notoriety generator at a given level
 */
export function calculateGeneratorCost(
  generator: NotorietyGenerator,
  level: number
): number {
  return Math.floor(
    generator.baseCost * Math.pow(generator.costMultiplier, level)
  );
}

/**
 * Get total upkeep cost (Creds/s) from all notoriety generators
 */
export function getTotalUpkeep(notorietyGenerators: NotorietyState): number {
  return (
    (notorietyGenerators.smm || 0) * 5000 +
    (notorietyGenerators.pr_team || 0) * 25000 +
    (notorietyGenerators.key_client || 0) * 250000
  );
}

/**
 * Check if player can afford a notoriety generator purchase
 * Must ensure Creds/s remains above 1 after purchase
 */
export function canPurchaseGenerator(
  state: GameState,
  generator: NotorietyGenerator,
  notorietyGenerators: NotorietyState,
  credsPerSecond: number
): boolean {
  const totalUpkeep = getTotalUpkeep(notorietyGenerators);
  const projectedUpkeep = totalUpkeep + generator.upkeep;
  const netCredsPerSecond = credsPerSecond - projectedUpkeep;
  return netCredsPerSecond >= 1;
}

/**
 * Get notoriety gain rate per second
 * Converts per-hour rates to per-second
 */
export function getNotorietyGainPerSecond(
  notorietyGenerators: NotorietyState
): number {
  const smm = (notorietyGenerators.smm || 0) * 1;
  const pr = (notorietyGenerators.pr_team || 0) * 5;
  const kc = (notorietyGenerators.key_client || 0) * 25;
  return (smm + pr + kc) / 3600;
}

/**
 * Get notoriety gain rate per hour (for display)
 */
export function getNotorietyGainPerHour(
  notorietyGenerators: NotorietyState
): number {
  const smm = (notorietyGenerators.smm || 0) * 1;
  const pr = (notorietyGenerators.pr_team || 0) * 5;
  const kc = (notorietyGenerators.key_client || 0) * 25;
  return smm + pr + kc;
}
