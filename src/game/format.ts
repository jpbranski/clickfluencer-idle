/**
 * format.ts - Large Number & Time Formatting Utilities
 * 
 * This module provides formatting functions for displaying large numbers
 * and time durations in human-readable formats.
 * 
 * Connected to:
 * - All UI components: Used for displaying followers, costs, time
 * - engine.ts: Formats offline progress messages
 */

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

const NUMBER_SUFFIXES = [
  { value: 1e3, suffix: 'K' },    // Thousand
  { value: 1e6, suffix: 'M' },    // Million
  { value: 1e9, suffix: 'B' },    // Billion
  { value: 1e12, suffix: 'T' },   // Trillion
  { value: 1e15, suffix: 'Qa' },  // Quadrillion
  { value: 1e18, suffix: 'Qi' },  // Quintillion
  { value: 1e21, suffix: 'Sx' },  // Sextillion
  { value: 1e24, suffix: 'Sp' },  // Septillion
  { value: 1e27, suffix: 'Oc' },  // Octillion
  { value: 1e30, suffix: 'No' },  // Nonillion
  { value: 1e33, suffix: 'Dc' },  // Decillion
  { value: 1e36, suffix: 'UDc' }, // Undecillion
  { value: 1e39, suffix: 'DDc' }, // Duodecillion
  { value: 1e42, suffix: 'TDc' }, // Tredecillion
  { value: 1e45, suffix: 'QaD' }, // Quattuordecillion
  { value: 1e48, suffix: 'QiD' }, // Quindecillion
];

/**
 * Format a number with appropriate suffix (K, M, B, T, etc.)
 * Examples:
 *   formatNumber(1500) => "1.50K"
 *   formatNumber(2500000) => "2.50M"
 *   formatNumber(1000000000) => "1.00B"
 */
export function formatNumber(num: number, decimals: number = 2): string {
  if (num < 0) return '-' + formatNumber(-num, decimals);
  if (num < 1000) return num.toFixed(decimals === 0 ? 0 : Math.min(decimals, 2));
  
  // Find the appropriate suffix
  for (let i = NUMBER_SUFFIXES.length - 1; i >= 0; i--) {
    const { value, suffix } = NUMBER_SUFFIXES[i];
    if (num >= value) {
      const formatted = (num / value).toFixed(decimals);
      return formatted + suffix;
    }
  }
  
  return num.toFixed(decimals);
}

/**
 * Format a number compactly (shorter version)
 * Examples:
 *   formatNumberCompact(1500) => "1.5K"
 *   formatNumberCompact(2500000) => "2.5M"
 */
export function formatNumberCompact(num: number): string {
  return formatNumber(num, 1);
}

/**
 * Format a number as an integer with commas
 * Examples:
 *   formatInteger(1500) => "1,500"
 *   formatInteger(1000000) => "1,000,000"
 */
export function formatInteger(num: number): string {
  return Math.floor(num).toLocaleString('en-US');
}

/**
 * Format a percentage
 * Examples:
 *   formatPercent(0.5) => "50%"
 *   formatPercent(0.0325) => "3.25%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Format rate (per second)
 * Examples:
 *   formatRate(10.5) => "10.5/s"
 *   formatRate(1500) => "1.50K/s"
 */
export function formatRate(rate: number): string {
  return formatNumber(rate, 2) + '/s';
}

/**
 * Format a multiplier
 * Examples:
 *   formatMultiplier(2) => "×2.00"
 *   formatMultiplier(1.5) => "×1.50"
 */
export function formatMultiplier(multiplier: number): string {
  return '×' + multiplier.toFixed(2);
}

// ============================================================================
// TIME FORMATTING
// ============================================================================

/**
 * Format milliseconds as human-readable duration
 * Examples:
 *   formatTime(5000) => "5s"
 *   formatTime(65000) => "1m 5s"
 *   formatTime(3665000) => "1h 1m"
 */
export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format time in a more detailed format
 * Examples:
 *   formatTimeDetailed(5000) => "5 seconds"
 *   formatTimeDetailed(65000) => "1 minute, 5 seconds"
 */
export function formatTimeDetailed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  if (hours % 24 > 0) {
    parts.push(`${hours % 24} ${hours % 24 === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60} ${minutes % 60 === 1 ? 'minute' : 'minutes'}`);
  }
  if (seconds % 60 > 0 && days === 0) {
    parts.push(`${seconds % 60} ${seconds % 60 === 1 ? 'second' : 'seconds'}`);
  }
  
  if (parts.length === 0) return '0 seconds';
  if (parts.length === 1) return parts[0];
  
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
}

/**
 * Format time compactly (only show largest two units)
 * Examples:
 *   formatTimeCompact(3665000) => "1h 1m"
 *   formatTimeCompact(90000) => "1m 30s"
 */
export function formatTimeCompact(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format countdown timer (always show h:mm:ss format)
 * Examples:
 *   formatCountdown(3665000) => "1:01:05"
 *   formatCountdown(65000) => "0:01:05"
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================================================
// COST/AFFORDABILITY FORMATTING
// ============================================================================

/**
 * Format cost with affordability indicator
 * Examples:
 *   formatCost(100, 150) => "100" (can afford)
 *   formatCost(100, 50) => "100" (cannot afford)
 */
export function formatCost(cost: number, current: number): string {
  const canAfford = current >= cost;
  return formatNumber(cost, 2);
}

/**
 * Calculate and format time until affordable
 * Examples:
 *   formatTimeUntilAffordable(1000, 500, 10) => "50s"
 *   formatTimeUntilAffordable(1000, 1000, 10) => "Can afford now"
 */
export function formatTimeUntilAffordable(
  cost: number,
  current: number,
  perSecond: number
): string {
  if (current >= cost) return 'Can afford now';
  if (perSecond <= 0) return 'Never';
  
  const remaining = cost - current;
  const secondsNeeded = remaining / perSecond;
  
  return formatTime(secondsNeeded * 1000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Parse a formatted number back to raw value
 * Examples:
 *   parseFormattedNumber("1.5K") => 1500
 *   parseFormattedNumber("2.5M") => 2500000
 */
export function parseFormattedNumber(str: string): number {
  const match = str.match(/^([\d.]+)([KMBTQ]|Qa|Qi|Sx|Sp|Oc|No|Dc|UDc|DDc|TDc|QaD|QiD)?$/);
  if (!match) return parseFloat(str) || 0;
  
  const [, numStr, suffix] = match;
  const num = parseFloat(numStr);
  
  if (!suffix) return num;
  
  const suffixData = NUMBER_SUFFIXES.find(s => s.suffix === suffix);
  return suffixData ? num * suffixData.value : num;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}