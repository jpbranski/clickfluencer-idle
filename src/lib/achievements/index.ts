/**
 * achievements/index.ts - Public Achievements API
 *
 * Exports all achievement-related functionality
 */

export {
  checkAchievements,
  unlockAchievement,
  checkWelcomeBackAchievement,
  getAchievementProgress,
} from "./evaluator";

export { ALL_ACHIEVEMENTS, getAchievementsByCategory, getAchievementCounts } from "@/data/achievements";
export type { AchievementCategory, AchievementDefinition } from "@/data/achievements";
