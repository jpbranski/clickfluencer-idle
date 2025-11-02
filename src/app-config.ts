/**
 * app-config.ts - Application Configuration & Feature Flags
 *
 * Centralized configuration for app-wide settings and feature toggles
 */

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  // PWA (Progressive Web App)
  enablePWA: false, // Set to true when PWA is configured

  // Advertisements
  enableAds: false, // Set to true when AdSense is configured

  // Analytics
  enableAnalytics: false, // Set to true when analytics is configured

  // Advanced features
  enableAchievements: true,
  enableLeaderboards: false, // Future feature
  enableMultiplayer: false, // Future feature

  // Debug features (development only)
  enableDebugMenu: process.env.NODE_ENV === "development",
  enableCheatCodes: process.env.NODE_ENV === "development",
  showPerformanceMetrics: process.env.NODE_ENV === "development",
};

// ============================================================================
// APP METADATA
// ============================================================================

export const APP_INFO = {
  name: "Clickfluencer Idle",
  shortName: "Clickfluencer",
  version: "v0.2.0 Early Access",
  description:
    "Build your social media empire from a single click to becoming the ultimate digital influencer",
  author: "Clickfluencer Team",
  website: "https://clickfluencer.app", // Update with actual domain

  // Social links (update with actual links)
  social: {
    twitter: "#",
    discord: "#",
    github: "#",
  },
};

// ============================================================================
// GAMEPLAY SETTINGS
// ============================================================================

export const GAMEPLAY = {
  // Auto-save
  autoSaveInterval: 5000, // 5 seconds
  autoSaveEnabled: true,

  // Notifications
  showNotifications: true,
  notificationDuration: 5000, // 5 seconds

  // Visual effects
  reducedMotion: false, // Overridden by system preference
  particleEffects: true,

  // Performance
  maxFloatingNumbers: 10, // Maximum simultaneous floating numbers
  maxEventLogEntries: 50,

  // Gameplay
  clickThrottleMs: 50, // 20 clicks per second max
  clickYieldVariance: 0.05, // ±5%
};

// ============================================================================
// STORAGE SETTINGS
// ============================================================================

export const STORAGE = {
  // Storage keys
  saveKey: "game_save",
  settingsKey: "game_settings",
  themeKey: "game_theme",

  // Backup settings
  maxBackups: 3,
  backupInterval: 300000, // 5 minutes

  // Compression
  compressSaves: true,
  compressionThreshold: 10000, // Bytes
};

// ============================================================================
// UI SETTINGS
// ============================================================================

export const UI = {
  // Theme
  defaultTheme: "default",
  systemThemeDetection: true,

  // Layout
  showFooter: true,
  showHeader: true,
  compactMode: false,

  // Currency display
  currencyDecimals: 2,
  compactNumbers: true,

  // Animations
  animationSpeed: 1, // 1 = normal, 0.5 = slow, 2 = fast
  transitionDuration: 150, // milliseconds
};

// ============================================================================
// EXTERNAL SERVICES
// ============================================================================

export const SERVICES = {
  // Google AdSense
  adsense: {
    enabled: FEATURES.enableAds,
    publisherId: "ca-pub-XXXXXXXXXX", // Replace with actual ID
    testMode: process.env.NODE_ENV === "development",
  },

  // Google Analytics
  analytics: {
    enabled: FEATURES.enableAnalytics,
    measurementId: "G-XXXXXXXXXX", // Replace with actual ID
    anonymizeIp: true,
  },

  // Sentry (Error tracking)
  sentry: {
    enabled: false,
    dsn: "", // Add Sentry DSN
    environment: process.env.NODE_ENV,
  },
};

// ============================================================================
// DEVELOPMENT SETTINGS
// ============================================================================

export const DEV = {
  // Logging
  logStateChanges: false,
  logActions: false,
  logEvents: true,

  // Debug helpers
  fastMode: false, // 10x production for testing
  unlockAll: false, // Unlock all content
  infiniteResources: false, // Unlimited resources

  // Performance
  showFPS: false,
  showMemoryUsage: false,
};

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

export const ENV = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  // Browser detection
  get isBrowser() {
    return typeof window !== "undefined";
  },

  get isServer() {
    return typeof window === "undefined";
  },

  // Mobile detection (simple check)
  get isMobile() {
    if (!this.isBrowser) return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },

  // Touch support
  get hasTouch() {
    if (!this.isBrowser) return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },
};

// ============================================================================
// API ENDPOINTS (for future features)
// ============================================================================

export const API = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
  endpoints: {
    leaderboard: "/api/leaderboard",
    achievements: "/api/achievements",
    stats: "/api/stats",
  },
  timeout: 10000, // 10 seconds
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONSTANTS = {
  // Time
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,

  // Numbers
  THOUSAND: 1e3,
  MILLION: 1e6,
  BILLION: 1e9,
  TRILLION: 1e12,

  // Limits
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}

/**
 * Get configuration value with type safety
 */
export function getConfig<T extends keyof typeof GAMEPLAY>(
  category: "gameplay",
  key: T,
): (typeof GAMEPLAY)[T];
export function getConfig<T extends keyof typeof UI>(
  category: "ui",
  key: T,
): (typeof UI)[T];
export function getConfig<T extends keyof typeof STORAGE>(
  category: "storage",
  key: T,
): (typeof STORAGE)[T];
export function getConfig(category: string, key: string): unknown {
  switch (category) {
    case "gameplay":
      return GAMEPLAY[key as keyof typeof GAMEPLAY];
    case "ui":
      return UI[key as keyof typeof UI];
    case "storage":
      return STORAGE[key as keyof typeof STORAGE];
    default:
      return undefined;
  }
}

/**
 * Update feature flag (for admin/debug purposes)
 */
export function setFeatureFlag(
  feature: keyof typeof FEATURES,
  enabled: boolean,
): void {
  if (ENV.isDevelopment) {
    FEATURES[feature] = enabled as never;
    console.log(`Feature "${feature}" ${enabled ? "enabled" : "disabled"}`);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  FEATURES,
  APP_INFO,
  GAMEPLAY,
  STORAGE,
  UI,
  SERVICES,
  DEV,
  ENV,
  API,
  CONSTANTS,
};
