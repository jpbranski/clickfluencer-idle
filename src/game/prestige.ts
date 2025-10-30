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
 * - Prestige threshold: 1 Billion (1e9) Reach (followers)
 * - Reward formula: Math.floor((reach / 1e9) ^ 0.4)
 * - Bonus: +10% to all production per Reputation point
 */

import { GameState, createInitialState } from './state';

// ============================================================================
// CONSTANTS
// ============================================================================

export const PRESTIGE_THRESHOLD = 1e9; // 1 Billion followers
export const PRESTIGE_EXPONENT = 0.4;
export const REPUTATION_BONUS_PERCENT = 0.10; // 10% per point

// ============================================================================
// PRESTIGE CALCULATIONS
// ============================================================================

/**
 * Check if player can prestige (has reached threshold)
 */
export function canPrestige(followers: number): boolean {
  return followers >= PRESTIGE_THRESHOLD;
}

/**
 * Calculate how many Reputation points would be earned from prestiging
 * Formula: floor((followers / 1e9) ^ 0.4)
 * 
 * Examples:
 *   1e9 followers => 1 Reputation
 *   1e10 followers => 2 Reputation
 *   1e11 followers => 3 Reputation
 */
export function calculateReputationGain(followers: number): number {
  if (followers < PRESTIGE_THRESHOLD) return 0;
  return Math.floor(Math.pow(followers / PRESTIGE_THRESHOLD, PRESTIGE_EXPONENT));
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

/**
 * Calculate how many followers needed to reach next reputation point
 */
export function getFollowersForNextReputation(currentReputation: number): number {
  const nextReputation = currentReputation + 1;
  return Math.ceil(PRESTIGE_THRESHOLD * Math.pow(nextReputation, 1 / PRESTIGE_EXPONENT));
}

/**
 * Get progress toward next reputation point (0-1)
 */
export function getReputationProgress(followers: number, currentReputation: number): number {
  if (followers < PRESTIGE_THRESHOLD) {
    return followers / PRESTIGE_THRESHOLD;
  }
  
  const currentReputationFollowers = PRESTIGE_THRESHOLD * Math.pow(currentReputation, 1 / PRESTIGE_EXPONENT);
  const nextReputationFollowers = getFollowersForNextReputation(currentReputation);
  
  return (followers - currentReputationFollowers) / (nextReputationFollowers - currentReputationFollowers);
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
 * Execute prestige: reset progress and award reputation
 * Returns result with stats about the prestige
 */
export function executePrestige(state: GameState): PrestigeResult {
  // Check if can prestige
  if (!canPrestige(state.followers)) {
    return {
      success: false,
      reputationGained: 0,
      totalReputation: state.reputation,
      followersLost: 0,
      message: `Need ${PRESTIGE_THRESHOLD.toExponential(0)} followers to prestige`,
    };
  }
  
  // Calculate reputation gain
  const reputationGained = calculateReputationGain(state.followers);
  const followersLost = state.followers;
  const totalReputation = state.reputation + reputationGained;
  
  return {
    success: true,
    reputationGained,
    totalReputation,
    followersLost,
    message: `Gained ${reputationGained} Reputation!`,
  };
}

/**
 * Reset game state for prestige while preserving certain elements
 * Preserves: reputation, shards, themes, statistics, settings
 * Resets: followers, generators, upgrades, events
 */
export function resetForPrestige(state: GameState, reputationGained: number): GameState {
  const initial = createInitialState();
  
  return {
    ...initial,
    // Preserve prestige currency and cosmetics
    reputation: state.reputation + reputationGained,
    shards: state.shards,
    themes: state.themes, // Keep unlocked themes
    
    // Update statistics
    stats: {
      ...initial.stats,
      totalClicks: state.stats.totalClicks,
      totalFollowersEarned: state.stats.totalFollowersEarned,
      totalGeneratorsPurchased: state.stats.totalGeneratorsPurchased,
      totalUpgradesPurchased: state.stats.totalUpgradesPurchased,
      prestigeCount: state.stats.prestigeCount + 1,
      shardsEarned: state.stats.shardsEarned,
      playTime: state.stats.playTime,
      lastTickTime: Date.now(),
      runStartTime: Date.now(),
    },
    
    // Preserve settings
    settings: state.settings,
    
    // Update meta
    version: state.version,
    lastSaveTime: Date.now(),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a recommendation on whether to prestige now
 * Returns advice based on potential gains
 */
export function getPrestigeRecommendation(state: GameState): {
  shouldPrestige: boolean;
  reason: string;
} {
  if (!canPrestige(state.followers)) {
    const needed = PRESTIGE_THRESHOLD - state.followers;
    return {
      shouldPrestige: false,
      reason: `Need ${needed.toExponential(2)} more followers to prestige`,
    };
  }
  
  const currentRepGain = calculateReputationGain(state.followers);
  const nextReputationFollowers = getFollowersForNextReputation(currentRepGain);
  const progress = getReputationProgress(state.followers, currentRepGain);
  
  // Recommend waiting if close to next reputation point
  if (progress > 0.75 && state.followers < nextReputationFollowers) {
    return {
      shouldPrestige: false,
      reason: `${(progress * 100).toFixed(0)}% to next Reputation point - consider waiting`,
    };
  }
  
  // Recommend prestiging if far from next point
  if (progress < 0.25) {
    return {
      shouldPrestige: true,
      reason: `Good time to prestige for ${currentRepGain} Reputation`,
    };
  }
  
  return {
    shouldPrestige: true,
    reason: `Ready to prestige for ${currentRepGain} Reputation`,
  };
}

/**
 * Calculate effective production multiplier after prestige
 * Shows what your production would be with new reputation
 */
export function getPostPrestigeMultiplier(state: GameState): number {
  const futureReputation = state.reputation + calculateReputationGain(state.followers);
  return calculateReputationBonus(futureReputation);
}

/**
 * Estimate time to reach prestige threshold
 * Returns estimated milliseconds, or Infinity if production is too low
 */
export function estimateTimeToPrestige(
  currentFollowers: number,
  followersPerSecond: number
): number {
  if (currentFollowers >= PRESTIGE_THRESHOLD) return 0;
  if (followersPerSecond <= 0) return Infinity;
  
  const needed = PRESTIGE_THRESHOLD - currentFollowers;
  return (needed / followersPerSecond) * 1000; // Convert to milliseconds
}