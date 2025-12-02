/**
 * clickLimiter.ts - Click Rate Limiting
 *
 * Prevents spam clicking and provides smooth click feedback.
 * Uses performance.now() for high-resolution timing.
 */

import { MIN_CLICK_INTERVAL } from "@/game/balance";

let lastClickTime = 0;

/**
 * Check if enough time has passed since the last click
 * Returns true if the click should be allowed
 *
 * @returns Whether the click is allowed
 */
export function canClick(): boolean {
  const now = performance.now();

  if (now - lastClickTime >= MIN_CLICK_INTERVAL) {
    lastClickTime = now;
    return true;
  }

  return false;
}

/**
 * Reset the click limiter
 * Useful for testing or after long pauses
 */
export function resetClickLimiter(): void {
  lastClickTime = 0;
}

/**
 * Get time until next click is allowed (in milliseconds)
 * Returns 0 if a click is currently allowed
 */
export function getTimeUntilNextClick(): number {
  const now = performance.now();
  const timeSinceLastClick = now - lastClickTime;

  if (timeSinceLastClick >= MIN_CLICK_INTERVAL) {
    return 0;
  }

  return MIN_CLICK_INTERVAL - timeSinceLastClick;
}
