/**
 * audio/index.ts - Audio Module Public API
 */

export {
  playClickSound,
  playAchievementSound,
  playPrestigeSound,
  playPurchaseSound,
  playUpgradeSound,
  playUIOpenSound,
  playUICloseSound,
  playNotificationSound,
  playAwardDropSound,
  playCredCacheSound,
  updateAudioSettings,
  getAudioSettings,
  preloadSounds,
  cleanupAudio,
} from "./manager";

export type { SoundId } from "./manager";
