/**
 * manager.ts - Audio Manager (Scaffolding)
 *
 * Provides audio playback hooks without requiring actual audio files.
 * All functions no-op gracefully if:
 * - Audio is muted/disabled
 * - Volume is 0
 * - Audio files don't exist
 *
 * Future: Add actual audio file loading and playback.
 */

export type SoundId =
  | "click"
  | "achievement"
  | "prestige"
  | "purchase"
  | "upgrade"
  | "ui_open"
  | "ui_close"
  | "notification"
  | "award_drop"
  | "cred_cache";

interface AudioSettings {
  enabled: boolean;
  masterVolume: number; // 0.0 to 1.0
}

// ============================================================================
// AUDIO STATE
// ============================================================================

let audioSettings: AudioSettings = {
  enabled: true,
  masterVolume: 0.7,
};

// Sound cache (for future implementation with real files)
const soundCache: Map<SoundId, HTMLAudioElement | null> = new Map();

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Update audio settings
 * Called from the game context when settings change
 */
export function updateAudioSettings(settings: Partial<AudioSettings>): void {
  audioSettings = { ...audioSettings, ...settings };
}

/**
 * Get current audio settings
 */
export function getAudioSettings(): AudioSettings {
  return { ...audioSettings };
}

// ============================================================================
// PLAYBACK FUNCTIONS
// ============================================================================

/**
 * Internal helper to determine if sound should play
 */
function shouldPlaySound(): boolean {
  return audioSettings.enabled && audioSettings.masterVolume > 0;
}

/**
 * Play a sound effect (no-op if disabled or file missing)
 *
 * @param soundId - Sound identifier
 * @param volume - Optional volume override (0.0 to 1.0)
 *
 * Future implementation:
 * - Load audio file from /public/sounds/{soundId}.mp3
 * - Create/cache HTMLAudioElement
 * - Set volume to masterVolume * (volume ?? 1.0)
 * - Play and catch errors gracefully
 */
function playSound(soundId: SoundId, volume?: number): void {
  if (!shouldPlaySound()) {
    return; // Audio disabled or muted
  }

  // Calculate effective volume
  const effectiveVolume = audioSettings.masterVolume * (volume ?? 1.0);

  if (effectiveVolume <= 0) {
    return; // Muted
  }

  // TODO: Future implementation
  // 1. Check cache for existing audio element
  // 2. If not cached, try to load from /public/sounds/{soundId}.mp3
  // 3. Set volume to effectiveVolume
  // 4. Play audio (with error handling)
  // 5. For now, just no-op

  // Debug log (only in development)
  if (process.env.NODE_ENV === "development") {
    console.debug(`[Audio] Would play: ${soundId} at volume ${effectiveVolume.toFixed(2)}`);
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Play click/post sound
 */
export function playClickSound(): void {
  playSound("click", 0.5); // Quieter for repetitive action
}

/**
 * Play achievement unlocked sound
 */
export function playAchievementSound(): void {
  playSound("achievement", 1.0);
}

/**
 * Play prestige sound
 */
export function playPrestigeSound(): void {
  playSound("prestige", 1.0);
}

/**
 * Play purchase/buy sound
 */
export function playPurchaseSound(): void {
  playSound("purchase", 0.6);
}

/**
 * Play upgrade sound
 */
export function playUpgradeSound(): void {
  playSound("upgrade", 0.7);
}

/**
 * Play UI open sound
 */
export function playUIOpenSound(): void {
  playSound("ui_open", 0.4);
}

/**
 * Play UI close sound
 */
export function playUICloseSound(): void {
  playSound("ui_close", 0.4);
}

/**
 * Play notification sound
 */
export function playNotificationSound(): void {
  playSound("notification", 0.6);
}

/**
 * Play award drop sound
 */
export function playAwardDropSound(): void {
  playSound("award_drop", 0.8);
}

/**
 * Play cred cache trigger sound
 */
export function playCredCacheSound(): void {
  playSound("cred_cache", 0.9);
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Preload all sounds (for future implementation)
 * Call this during game initialization
 */
export function preloadSounds(): Promise<void> {
  // TODO: Future implementation
  // Load all sound files into cache
  // Return promise that resolves when all loaded
  return Promise.resolve();
}

/**
 * Cleanup audio resources
 */
export function cleanupAudio(): void {
  soundCache.clear();
}
