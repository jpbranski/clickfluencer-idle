/**
 * evaluator.ts - Achievement Condition Evaluator
 *
 * Evaluates achievement unlock conditions based on current game state.
 * This module is called on every tick and on specific game events to check
 * if any achievements should be unlocked.
 *
 * Performance note: Evaluation is fast due to early returns and incremental checks.
 */

import type { GameState, Achievement } from "@/game/state";
import { getClickPower, getFollowersPerSecond } from "@/game/state";
import { ALL_ACHIEVEMENTS, type AchievementDefinition } from "@/data/achievements";

/**
 * Evaluate a single achievement condition
 * Returns true if the achievement should be unlocked
 */
function evaluateCondition(
  achievement: AchievementDefinition,
  state: GameState,
  clickPower: number,
  credsPerSecond: number,
): boolean {
  const { conditionKey, conditionValue } = achievement;
  const stats = state.stats;

  switch (conditionKey) {
    // ========== Click-based conditions ==========
    case "totalClicks":
      return stats.totalClicks >= (conditionValue as number);

    case "clickPower":
      return clickPower >= (conditionValue as number);

    // ========== Currency conditions ==========
    case "totalCredsEarned":
      return stats.totalCredsEarned >= (conditionValue as number);

    case "awardsEarned":
      return stats.awardsEarned >= (conditionValue as number);

    case "prestigeCurrency":
      return state.prestige >= (conditionValue as number);

    case "notoriety":
      return state.notoriety >= (conditionValue as number);

    // ========== Generator/Upgrade conditions ==========
    case "totalGeneratorsPurchased":
      return stats.totalGeneratorsPurchased >= (conditionValue as number);

    case "totalUpgradesPurchased":
      return stats.totalUpgradesPurchased >= (conditionValue as number);

    case "allGeneratorsUnlocked":
      return state.generators.every((g) => g.unlocked);

    // ========== Prestige conditions ==========
    case "prestigeCount":
      return stats.prestigeCount >= (conditionValue as number);

    case "prestigeExact":
      // Special: must match exactly (for "Prestigious Fool" at level 42)
      return stats.prestigeCount === (conditionValue as number);

    // ========== Theme conditions ==========
    case "themesUnlocked":
      return state.themes.filter((t) => t.unlocked).length >= (conditionValue as number);

    case "allThemesUnlocked":
      return state.themes.every((t) => t.unlocked);

    // ========== Meta/Time conditions ==========
    case "playTime":
      return stats.playTime >= (conditionValue as number);

    case "sessionCount":
      return stats.sessionCount >= (conditionValue as number);

    case "returnAfter24h":
      // Special: "Welcome Back" achievement
      // Unlocks if player returns after being away for 24+ hours
      // This is checked on load, not every tick
      // The check happens in the load process, so we return false here
      // (will be manually unlocked in the load handler)
      return false;

    default:
      console.warn(`Unknown achievement condition key: ${conditionKey}`);
      return false;
  }
}

/**
 * Check all achievements and return IDs of newly unlocked ones
 * This is called every tick and on specific events
 */
export function checkAchievements(
  state: GameState,
): { newlyUnlocked: string[]; updatedAchievements: Achievement[] } {
  if (!state.achievements) {
    return { newlyUnlocked: [], updatedAchievements: [] };
  }

  const newlyUnlocked: string[] = [];
  const clickPower = getClickPower(state);
  const credsPerSecond = getFollowersPerSecond(state);

  // Create updated achievements array
  const updatedAchievements = state.achievements.map((achievement) => {
    // Skip if already unlocked
    if (achievement.unlocked) {
      return achievement;
    }

    // Find the definition
    const definition = ALL_ACHIEVEMENTS.find((def) => def.id === achievement.id);
    if (!definition) {
      return achievement;
    }

    // Evaluate the condition
    const shouldUnlock = evaluateCondition(definition, state, clickPower, credsPerSecond);

    if (shouldUnlock) {
      newlyUnlocked.push(achievement.id);
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
      };
    }

    return achievement;
  });

  return { newlyUnlocked, updatedAchievements };
}

/**
 * Manually unlock a specific achievement
 * Used for special conditions like "Welcome Back"
 */
export function unlockAchievement(
  state: GameState,
  achievementId: string,
): Achievement[] {
  if (!state.achievements) {
    return [];
  }

  return state.achievements.map((achievement) => {
    if (achievement.id === achievementId && !achievement.unlocked) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: Date.now(),
      };
    }
    return achievement;
  });
}

/**
 * Check if player is returning after 24+ hours for "Welcome Back" achievement
 * This is called during game load
 */
export function checkWelcomeBackAchievement(
  lastPlayDate: number | undefined,
): boolean {
  if (!lastPlayDate) {
    return false; // First-time player
  }

  const now = Date.now();
  const hoursSinceLastPlay = (now - lastPlayDate) / (1000 * 60 * 60);

  return hoursSinceLastPlay >= 24;
}

/**
 * Get achievement progress for display (0.0 to 1.0)
 * Returns 1.0 if unlocked, otherwise returns progress toward unlock
 */
export function getAchievementProgress(
  achievement: Achievement,
  state: GameState,
): number {
  if (achievement.unlocked) {
    return 1.0;
  }

  // Find the definition
  const definition = ALL_ACHIEVEMENTS.find((def) => def.id === achievement.id);
  if (!definition || !definition.conditionValue) {
    return 0;
  }

  const { conditionKey, conditionValue } = definition;
  const stats = state.stats;

  let current = 0;
  let target = conditionValue as number;

  switch (conditionKey) {
    case "totalClicks":
      current = stats.totalClicks;
      break;
    case "clickPower":
      current = getClickPower(state);
      break;
    case "totalCredsEarned":
      current = stats.totalCredsEarned;
      break;
    case "awardsEarned":
      current = stats.awardsEarned;
      break;
    case "prestigeCurrency":
      current = state.prestige;
      break;
    case "notoriety":
      current = state.notoriety;
      break;
    case "totalGeneratorsPurchased":
      current = stats.totalGeneratorsPurchased;
      break;
    case "totalUpgradesPurchased":
      current = stats.totalUpgradesPurchased;
      break;
    case "prestigeCount":
      current = stats.prestigeCount;
      break;
    case "playTime":
      current = stats.playTime;
      break;
    case "sessionCount":
      current = stats.sessionCount;
      break;
    default:
      return 0;
  }

  return Math.min(1.0, current / target);
}
