/**
 * notorietyUpgrades.ts - Notoriety Upgrade System
 *
 * Defines permanent upgrades that cost Notoriety and provide various bonuses.
 * These upgrades persist through prestige and provide permanent benefits.
 */

import { GameState } from "../state";
import { getFollowersPerSecond } from "../state";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NotorietyUpgrade {
  id: string;
  name: string;
  effect: string; // Description of the effect
  cap: number; // Maximum level (Infinity for infinite upgrades)
  costFormula: (level: number) => number; // Function to calculate cost at level
  effectType:
    | "credCacheBoost" // Increases Cred Cache payout
    | "dramaBoost" // Increases global prestige bonus
    | "instantCreds" // Instantly grants followers based on production
    | "credBoost" // Increases passive followers per second
    | "notorietyBoost" // Increases total Notoriety gain
    | "influencerEndorsement"; // Tiered prestige gain bonuses
  effectValue: number | number[]; // Value(s) for the effect
}

// ============================================================================
// NOTORIETY UPGRADES
// ============================================================================

export const NOTORIETY_UPGRADES: NotorietyUpgrade[] = [
  {
    id: "cache_value",
    name: "Cache Value Increase",
    cap: 10,
    effect: "+5% to Cred Cache payout per level",
    costFormula: (level) => 10 * level,
    effectType: "credCacheBoost",
    effectValue: 0.05, // +5% per level
  },
  {
    id: "drama_boost",
    name: "Drama Multiplier Boost",
    cap: 5,
    effect: "+0.2% to global Prestige bonus per level",
    costFormula: (level) => 25 * Math.pow(2.5, level),
    effectType: "dramaBoost",
    effectValue: 0.002, // +0.2% per level
  },
  {
    id: "buy_creds",
    name: "Buy Creds",
    cap: Infinity,
    effect: "Instantly grants 30 minutes of current followers/s",
    costFormula: () => 10,
    effectType: "instantCreds",
    effectValue: 1800, // 30 minutes in seconds
  },
  {
    id: "cred_boost",
    name: "Cred Boost",
    cap: Infinity,
    effect: "+1% to all passive followers/s",
    costFormula: (level) => 50 * Math.pow(1.4, level),
    effectType: "credBoost",
    effectValue: 0.01, // +1% per level
  },
  {
    id: "notoriety_boost",
    name: "Notoriety Boost",
    cap: Infinity,
    effect: "+1% to total Notoriety/hr",
    costFormula: (level) => 100 * Math.pow(1.55, level),
    effectType: "notorietyBoost",
    effectValue: 0.01, // +1% per level
  },
  {
    id: "influencer_endorsement",
    name: "Influencer Endorsement",
    cap: 3,
    effect: "+10%, +25%, +50% Prestige gain bonuses",
    costFormula: (level) => 1000 * Math.pow(3, level),
    effectType: "influencerEndorsement",
    effectValue: [0.1, 0.25, 0.5], // +10%, +25%, +50% at levels 1, 2, 3
  },
];

// ============================================================================
// UPGRADE LOGIC
// ============================================================================

/**
 * Get the cost of a notoriety upgrade at the current level
 */
export function getUpgradeCost(
  upgrade: NotorietyUpgrade,
  currentLevel: number
): number {
  if (currentLevel >= upgrade.cap) {
    return Infinity; // Already at max level
  }
  return Math.floor(upgrade.costFormula(currentLevel));
}

/**
 * Check if the player can afford a notoriety upgrade
 */
export function canAffordUpgrade(
  notoriety: number,
  upgrade: NotorietyUpgrade,
  currentLevel: number
): boolean {
  if (currentLevel >= upgrade.cap) {
    return false; // Already at max level
  }
  const cost = getUpgradeCost(upgrade, currentLevel);
  return notoriety >= cost;
}

/**
 * Apply the effect of a notoriety upgrade purchase
 * Returns the updated game state
 */
export function applyUpgradeEffect(
  state: GameState,
  upgrade: NotorietyUpgrade
): Partial<GameState> {
  const currentLevel = state.notorietyUpgrades?.[upgrade.id] || 0;

  switch (upgrade.effectType) {
    case "instantCreds": {
      // Instantly grant 30 minutes of current followers/s
      const followersPerSecond = getFollowersPerSecond(state);
      const instantFollowers =
        followersPerSecond * (upgrade.effectValue as number);
      return {
        followers: state.followers + instantFollowers,
      };
    }
    // Other effects are passive and applied during calculation
    default:
      return {};
  }
}

/**
 * Get the total Cred Cache boost multiplier from upgrades
 */
export function getCredCacheBoostMultiplier(
  notorietyUpgrades: Record<string, number>
): number {
  const cacheValue = notorietyUpgrades?.cache_value || 0;
  const upgrade = NOTORIETY_UPGRADES.find((u) => u.id === "cache_value");
  if (!upgrade) return 1;

  const boost = cacheValue * (upgrade.effectValue as number);
  return 1 + boost; // 1 + (0.05 * level)
}

/**
 * Get the total Drama boost multiplier from upgrades
 */
export function getDramaBoostMultiplier(
  notorietyUpgrades: Record<string, number>
): number {
  const dramaBoost = notorietyUpgrades?.drama_boost || 0;
  const upgrade = NOTORIETY_UPGRADES.find((u) => u.id === "drama_boost");
  if (!upgrade) return 1;

  const boost = dramaBoost * (upgrade.effectValue as number);
  return 1 + boost; // 1 + (0.002 * level)
}

/**
 * Get the total Cred boost multiplier from upgrades
 */
export function getCredBoostMultiplier(
  notorietyUpgrades: Record<string, number>
): number {
  const credBoost = notorietyUpgrades?.cred_boost || 0;
  const upgrade = NOTORIETY_UPGRADES.find((u) => u.id === "cred_boost");
  if (!upgrade) return 1;

  const boost = credBoost * (upgrade.effectValue as number);
  return 1 + boost; // 1 + (0.01 * level)
}

/**
 * Get the total Notoriety boost multiplier from upgrades
 */
export function getNotorietyBoostMultiplier(
  notorietyUpgrades: Record<string, number>
): number {
  const notorietyBoost = notorietyUpgrades?.notoriety_boost || 0;
  const upgrade = NOTORIETY_UPGRADES.find((u) => u.id === "notoriety_boost");
  if (!upgrade) return 1;

  const boost = notorietyBoost * (upgrade.effectValue as number);
  return 1 + boost; // 1 + (0.01 * level)
}

/**
 * Get the Influencer Endorsement prestige bonus multiplier
 */
export function getInfluencerEndorsementMultiplier(
  notorietyUpgrades: Record<string, number>
): number {
  const level = notorietyUpgrades?.influencer_endorsement || 0;
  const upgrade = NOTORIETY_UPGRADES.find(
    (u) => u.id === "influencer_endorsement"
  );
  if (!upgrade || level === 0) return 1;

  const bonuses = upgrade.effectValue as number[];
  if (level > 0 && level <= bonuses.length) {
    return 1 + bonuses[level - 1]; // Level 1 = +10%, Level 2 = +25%, Level 3 = +50%
  }

  return 1;
}

/**
 * Get a notoriety upgrade by ID
 */
export function getUpgradeById(id: string): NotorietyUpgrade | undefined {
  return NOTORIETY_UPGRADES.find((upgrade) => upgrade.id === id);
}
