/**
 * localStorage.ts - LocalStorage Fallback Driver
 * 
 * Fallback storage driver using localStorage.
 * Used when IndexedDB is unavailable or fails.
 * 
 * Connected to:
 * - storage.ts: Called by storage orchestrator as fallback
 */

import { StoredData, BackupData } from './indexedDb';

// ============================================================================
// CONSTANTS
// ============================================================================

const KEY_PREFIX = 'clickfluencer_';
const BACKUP_PREFIX = 'clickfluencer_backup_';

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Save data to localStorage
 * 
 * @param key - Storage key
 * @param value - Data to store (string)
 * @param checksum - Data checksum for integrity
 */
export function saveToLocalStorage(
  key: string,
  value: string,
  checksum: string
): void {
  const data: StoredData = {
    key,
    value,
    timestamp: Date.now(),
    checksum,
  };

  const storageKey = KEY_PREFIX + key;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

/**
 * Load data from localStorage
 * 
 * @param key - Storage key
 * @returns Stored data or null if not found
 */
export function loadFromLocalStorage(key: string): StoredData | null {
  try {
    const storageKey = KEY_PREFIX + key;
    const item = localStorage.getItem(storageKey);
    
    if (!item) return null;
    
    const data = JSON.parse(item) as StoredData;
    return data;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

/**
 * Delete data from localStorage
 * 
 * @param key - Storage key
 */
export function deleteFromLocalStorage(key: string): void {
  const storageKey = KEY_PREFIX + key;
  localStorage.removeItem(storageKey);
}

/**
 * Check if a key exists in localStorage
 * 
 * @param key - Storage key
 * @returns True if exists, false otherwise
 */
export function existsInLocalStorage(key: string): boolean {
  const storageKey = KEY_PREFIX + key;
  return localStorage.getItem(storageKey) !== null;
}

/**
 * Get all keys from localStorage
 * 
 * @returns Array of all keys (without prefix)
 */
export function getAllKeysFromLocalStorage(): string[] {
  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_PREFIX) && !key.startsWith(BACKUP_PREFIX)) {
      keys.push(key.substring(KEY_PREFIX.length));
    }
  }
  
  return keys;
}

// ============================================================================
// BACKUP OPERATIONS
// ============================================================================

/**
 * Generate backup key for localStorage
 * 
 * @param id - Backup ID
 * @param key - Original storage key
 * @returns Backup storage key
 */
function getBackupKey(id: string, key: string): string {
  return `${BACKUP_PREFIX}${key}_${id}`;
}

/**
 * Parse backup key to extract original key and ID
 * 
 * @param backupKey - Backup storage key
 * @returns Object with key and id, or null if invalid
 */
function parseBackupKey(backupKey: string): { key: string; id: string } | null {
  if (!backupKey.startsWith(BACKUP_PREFIX)) return null;
  
  const withoutPrefix = backupKey.substring(BACKUP_PREFIX.length);
  const lastUnderscore = withoutPrefix.lastIndexOf('_');
  
  if (lastUnderscore === -1) return null;
  
  const key = withoutPrefix.substring(0, lastUnderscore);
  const id = withoutPrefix.substring(lastUnderscore + 1);
  
  return { key, id };
}

/**
 * Save a backup to localStorage
 * 
 * @param id - Backup ID
 * @param key - Original storage key
 * @param value - Data to backup
 * @param checksum - Data checksum
 */
export function saveBackupToLocalStorage(
  id: string,
  key: string,
  value: string,
  checksum: string
): void {
  const backup: BackupData = {
    id,
    key,
    value,
    timestamp: Date.now(),
    checksum,
  };

  const backupKey = getBackupKey(id, key);
  localStorage.setItem(backupKey, JSON.stringify(backup));
}

/**
 * Load all backups for a key from localStorage
 * 
 * @param key - Storage key
 * @returns Array of backups, sorted by timestamp (newest first)
 */
export function loadBackupsFromLocalStorage(key: string): BackupData[] {
  const backups: BackupData[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i);
    if (!storageKey || !storageKey.startsWith(BACKUP_PREFIX)) continue;
    
    const parsed = parseBackupKey(storageKey);
    if (!parsed || parsed.key !== key) continue;
    
    try {
      const item = localStorage.getItem(storageKey);
      if (!item) continue;
      
      const backup = JSON.parse(item) as BackupData;
      backups.push(backup);
    } catch (error) {
      console.error('Failed to parse backup from localStorage:', error);
    }
  }
  
  // Sort by timestamp descending (newest first)
  return backups.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Delete old backups, keeping only the most recent N
 * 
 * @param key - Storage key
 * @param keepCount - Number of backups to keep (default 3)
 */
export function pruneBackupsInLocalStorage(key: string, keepCount: number = 3): void {
  const backups = loadBackupsFromLocalStorage(key);
  
  // Delete backups beyond keepCount
  const toDelete = backups.slice(keepCount);
  
  for (const backup of toDelete) {
    const backupKey = getBackupKey(backup.id, key);
    localStorage.removeItem(backupKey);
  }
}

/**
 * Delete all backups for a key
 * 
 * @param key - Storage key
 */
export function deleteBackupsFromLocalStorage(key: string): void {
  const backups = loadBackupsFromLocalStorage(key);
  
  for (const backup of backups) {
    const backupKey = getBackupKey(backup.id, key);
    localStorage.removeItem(backupKey);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if localStorage is available
 * 
 * @returns True if available, false otherwise
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get localStorage size estimate
 * 
 * @returns Estimated size in bytes
 */
export function getLocalStorageSize(): number {
  let total = 0;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    const value = localStorage.getItem(key);
    if (!value) continue;
    
    // Estimate: key length + value length in UTF-16 characters * 2 bytes
    total += (key.length + value.length) * 2;
  }
  
  return total;
}

/**
 * Clear all game data from localStorage (for testing/reset)
 */
export function clearLocalStorage(): void {
  const keys = getAllKeysFromLocalStorage();
  
  for (const key of keys) {
    deleteFromLocalStorage(key);
    deleteBackupsFromLocalStorage(key);
  }
}

/**
 * Get remaining localStorage space (approximate)
 * Most browsers limit to ~5-10MB
 * 
 * @returns Estimated remaining space in bytes
 */
export function getRemainingLocalStorageSpace(): number {
  const QUOTA = 5 * 1024 * 1024; // Assume 5MB quota
  const used = getLocalStorageSize();
  return Math.max(0, QUOTA - used);
}