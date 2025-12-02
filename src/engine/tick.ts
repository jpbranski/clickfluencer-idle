/**
 * tick.ts - Pure Game Tick Function
 *
 * Heart of the game loop. This is a pure function that takes the current state
 * and delta time, and returns the new state after one tick.
 *
 * NO side effects - no network calls, no DOM manipulation, no React state updates.
 * Just pure game logic.
 */

import {
  GameState,
  getFollowersPerSecond,
  getClickPower,
} from "@/game/state";
import {
  getNotorietyGainPerSecond,
  getTotalUpkeep,
} from "@/game/logic/notorietyLogic";
import { checkAchievements } from "@/lib/achievements";

// ============================================================================
// MAIN TICK FUNCTION
// ============================================================================

/**
 * Process one game tick
 *
 * @param state - Current game state
 * @param deltaTime - Time elapsed since last tick (in milliseconds)
 * @returns New game state after applying all tick logic
 */
export function engineTick(state: GameState, deltaTime: number): GameState {
  // Convert delta time to seconds
  const deltaSeconds = deltaTime / 1000;

  // Calculate production rates
  const credsPerSecond = getFollowersPerSecond(state);
  const notorietyPerSecond = getNotorietyGainPerSecond(state);
  const upkeep = getTotalUpkeep(state);

  // Calculate gains/losses for this tick
  const credsGained = credsPerSecond * deltaSeconds;
  const notorietyGained = notorietyPerSecond * deltaSeconds;
  const credsLost = upkeep * deltaSeconds;

  // Net creds change (can be negative if upkeep > production)
  const netCredsChange = credsGained - credsLost;

  // Calculate new values
  let newCreds = state.creds + netCredsChange;
  let newNotoriety = state.notoriety + notorietyGained;

  // Prevent creds from going negative
  // If creds would go negative, pause notoriety gain
  if (newCreds < 0) {
    newCreds = 0;
    newNotoriety = state.notoriety; // Pause notoriety gain when broke
  }

  // Prevent notoriety from going negative
  if (newNotoriety < 0) {
    newNotoriety = 0;
  }

  // Update active events (remove expired ones)
  const now = Date.now();
  const activeEvents = state.activeEvents.filter(
    (event) => !event.endTime || event.endTime > now
  );

  // Build new state
  let newState: GameState = {
    ...state,
    creds: newCreds,
    notoriety: newNotoriety,
    activeEvents,
    stats: {
      ...state.stats,
      totalCredsEarned: state.stats.totalCredsEarned + Math.max(0, credsGained),
      playTime: state.stats.playTime + deltaTime,
      lastTickTime: now,

      // Update high-score metrics
      highestClickPower: Math.max(
        state.stats.highestClickPower || 0,
        getClickPower(state)
      ),
      highestCredsPerSecond: Math.max(
        state.stats.highestCredsPerSecond || 0,
        credsPerSecond
      ),
      highestCredsOwned: Math.max(
        state.stats.highestCredsOwned || 0,
        newCreds
      ),
      highestAwardsOwned: Math.max(
        state.stats.highestAwardsOwned || 0,
        state.awards
      ),
      highestPrestigeOwned: Math.max(
        state.stats.highestPrestigeOwned || 0,
        state.prestige
      ),
      highestNotorietyOwned: Math.max(
        state.stats.highestNotorietyOwned || 0,
        newNotoriety
      ),
    },
  };

  // Check for newly unlocked achievements
  const achievementResult = checkAchievements(newState);
  if (achievementResult.newlyUnlocked.length > 0) {
    newState = {
      ...newState,
      achievements: achievementResult.updatedAchievements,
    };
  }

  return newState;
}

// ============================================================================
// OFFLINE TICK (Simplified)
// ============================================================================

/**
 * Process offline progress
 *
 * @param state - Current game state
 * @param timeAwayMs - Time away in milliseconds
 * @param offlineEfficiency - Offline gain efficiency (0.0 to 1.0)
 * @returns New game state with offline gains applied
 */
export function processOfflineTick(
  state: GameState,
  timeAwayMs: number,
  offlineEfficiency: number
): GameState {
  const timeAwaySeconds = timeAwayMs / 1000;

  // Calculate offline gains (no notoriety gain or upkeep while offline - player-friendly)
  const credsPerSecond = getFollowersPerSecond(state);
  const offlineCredsGained = credsPerSecond * timeAwaySeconds * offlineEfficiency;

  return {
    ...state,
    creds: state.creds + offlineCredsGained,
    stats: {
      ...state.stats,
      totalCredsEarned: state.stats.totalCredsEarned + offlineCredsGained,
      totalAfkTime: (state.stats.totalAfkTime || 0) + timeAwayMs,
      playTime: state.stats.playTime + timeAwayMs,
    },
  };
}
