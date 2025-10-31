/**
 * hash.ts - SHA-256 Hashing Utilities
 *
 * Provides cryptographic hashing for save data integrity checking.
 * Uses Web Crypto API for secure, built-in hashing.
 *
 * Connected to:
 * - storage.ts: Used for checksum validation
 */

// ============================================================================
// CONSTANTS
// ============================================================================

// Secret pepper for checksum validation (prevents trivial tampering)
// In production, this should be environment-specific and more complex
const CHECKSUM_PEPPER = "clickfluencer_idle_v1_pepper_2025";

// ============================================================================
// HASHING FUNCTIONS
// ============================================================================

/**
 * Generate SHA-256 hash of a string
 * Uses Web Crypto API for secure hashing
 *
 * @param data - String to hash
 * @returns Promise resolving to hex-encoded hash string
 */
export async function sha256(data: string): Promise<string> {
  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Hash the data
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Generate checksum for save data with pepper
 * Adds secret pepper to prevent trivial tampering
 *
 * @param data - Data to generate checksum for
 * @returns Promise resolving to checksum string
 */
export async function generateChecksum(data: string): Promise<string> {
  const peppered = data + CHECKSUM_PEPPER;
  return sha256(peppered);
}

/**
 * Verify checksum matches data
 *
 * @param data - Data to verify
 * @param checksum - Expected checksum
 * @returns Promise resolving to true if valid, false otherwise
 */
export async function verifyChecksum(
  data: string,
  checksum: string,
): Promise<boolean> {
  const computed = await generateChecksum(data);
  return computed === checksum;
}

/**
 * Generate a simple hash for quick comparison (non-cryptographic)
 * Used for change detection, not security
 *
 * @param str - String to hash
 * @returns Numeric hash
 */
export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Generate a random ID string
 * Used for backup IDs and unique identifiers
 *
 * @param length - Length of ID (default 16)
 * @returns Random alphanumeric string
 */
export function generateId(length: number = 16): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }

  return result;
}

/**
 * Check if Web Crypto API is available
 *
 * @returns True if available, false otherwise
 */
export function isCryptoAvailable(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined" &&
    typeof crypto.subtle.digest === "function"
  );
}
