/**
 * storage.ts - Storage Orchestrator
 * 
 * Manages game save data with:
 * - Automatic driver selection (IndexedDB primary, localStorage fallback)
 * - Base64 + JSON encoding
 * - SHA-256 checksum validation with pepper
 * - Rolling 3-backup system
 * - Version-based migrations
 * - Corruption detection and recovery
 * 
 * Connected to:
 * - indexedDb.ts: Primary storage driver
 * - localStorage.ts: Fallback storage driver
 * - hash.ts: Checksum generation and verification
 * - Game state: Saves and loads GameState
 */

import {
  saveToIndexedDB,
  loadFromIndexedDB,
  deleteFromIndexedDB,
  existsInIndexedDB,
  saveBackupToIndexedDB,
  loadBackupsFromIndexedDB,
  pruneBackupsInIndexedDB,
  isIndexedDBAvailable,
  StoredData,
} from './indexedDb';

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  deleteFromLocalStorage,
  existsInLocalStorage,
  saveBackupToLocalStorage,
  loadBackupsFromLocalStorage,
  pruneBackupsInLocalStorage,
  isLocalStorageAvailable,
} from './localStorage';

import { generateChecksum, verifyChecksum, generateId } from '../crypto/hash';

// ============================================================================
// CONSTANTS
// ============================================================================

export const SAVE_KEY = 'game_save';
export const CURRENT_VERSION = 1;
export const MAX_BACKUPS = 3;

// ============================================================================
// TYPES
// ============================================================================

export interface SaveData<T = unknown> {
  version: number;
  data: T;
  timestamp: number;
}

export interface SaveResult {
  success: boolean;
  error?: string;
  usedFallback?: boolean;
}

export interface LoadResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  restoredFromBackup?: boolean;
  usedFallback?: boolean;
}

export type StorageDriver = 'indexeddb' | 'localstorage';

// ============================================================================
// DRIVER SELECTION
// ============================================================================

let preferredDriver: StorageDriver | null = null;

/**
 * Detect and set the preferred storage driver
 * Tries IndexedDB first, falls back to localStorage
 */
function detectDriver(): StorageDriver {
  if (preferredDriver) return preferredDriver;

  if (isIndexedDBAvailable()) {
    preferredDriver = 'indexeddb';
    return 'indexeddb';
  }

  if (isLocalStorageAvailable()) {
    console.warn('IndexedDB unavailable, using localStorage fallback');
    preferredDriver = 'localstorage';
    return 'localstorage';
  }

  throw new Error('No storage driver available');
}

/**
 * Force a specific storage driver (for testing)
 */
export function setStorageDriver(driver: StorageDriver): void {
  preferredDriver = driver;
}

/**
 * Get current storage driver
 */
export function getStorageDriver(): StorageDriver {
  return detectDriver();
}

// ============================================================================
// ENCODING/DECODING
// ============================================================================

/**
 * Encode data to base64 JSON string
 */
function encodeData<T>(data: T): string {
  const json = JSON.stringify(data);
  
  // Use btoa for base64 encoding (browser-compatible)
  // For Unicode support, first encode to UTF-8
  const encoder = new TextEncoder();
  const utf8Array = encoder.encode(json);
  
  // Convert to binary string
  let binaryString = '';
  for (let i = 0; i < utf8Array.length; i++) {
    binaryString += String.fromCharCode(utf8Array[i]);
  }
  
  return btoa(binaryString);
}

/**
 * Decode base64 JSON string to data
 */
function decodeData<T>(encoded: string): T {
  // Decode base64
  const binaryString = atob(encoded);
  
  // Convert to UTF-8
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const decoder = new TextDecoder();
  const json = decoder.decode(bytes);
  
  return JSON.parse(json) as T;
}

// ============================================================================
// MIGRATION SYSTEM
// ============================================================================

/**
 * Migrate save data from old version to current version
 */
function migrateSaveData<T>(saveData: SaveData<T>): SaveData<T> {
  let migrated = { ...saveData };

  // Apply migrations sequentially from old version to current
  for (let v = saveData.version; v < CURRENT_VERSION; v++) {
    migrated = applyMigration(migrated, v, v + 1);
  }

  return migrated;
}

/**
 * Apply a single migration step
 */
function applyMigration<T>(
  saveData: SaveData<T>,
  fromVersion: number,
  toVersion: number
): SaveData<T> {
  console.log(`Migrating save data from v${fromVersion} to v${toVersion}`);

  // Add migration logic here for each version bump
  // Example:
  // if (fromVersion === 1 && toVersion === 2) {
  //   // Perform v1 to v2 migration
  //   const oldData = saveData.data as any;
  //   const newData = { ...oldData, newField: 'defaultValue' };
  //   return { ...saveData, data: newData as T, version: toVersion };
  // }

  // For now, just update version number
  return { ...saveData, version: toVersion };
}

// ============================================================================
// BACKUP MANAGEMENT
// ============================================================================

/**
 * Create a backup of current save
 */
async function createBackup(data: string, checksum: string): Promise<void> {
  const driver = detectDriver();
  const backupId = generateId();

  if (driver === 'indexeddb') {
    await saveBackupToIndexedDB(backupId, SAVE_KEY, data, checksum);
    await pruneBackupsInIndexedDB(SAVE_KEY, MAX_BACKUPS);
  } else {
    saveBackupToLocalStorage(backupId, SAVE_KEY, data, checksum);
    pruneBackupsInLocalStorage(SAVE_KEY, MAX_BACKUPS);
  }
}

/**
 * Restore from most recent valid backup
 */
async function restoreFromBackup(): Promise<StoredData | null> {
  const driver = detectDriver();
  
  const backups = driver === 'indexeddb'
    ? await loadBackupsFromIndexedDB(SAVE_KEY)
    : loadBackupsFromLocalStorage(SAVE_KEY);

  // Try each backup from newest to oldest
  for (const backup of backups) {
    try {
      // Verify checksum
      const isValid = await verifyChecksum(backup.value, backup.checksum);
      
      if (isValid) {
        console.log('Successfully restored from backup');
        return {
          key: backup.key,
          value: backup.value,
          timestamp: backup.timestamp,
          checksum: backup.checksum,
        };
      }
    } catch (error) {
      console.error('Backup verification failed:', error);
    }
  }

  return null;
}

// ============================================================================
// SAVE OPERATION
// ============================================================================

/**
 * Save game data
 * 
 * @param data - Data to save
 * @returns Result with success status
 */
export async function save<T>(data: T): Promise<SaveResult> {
  try {
    const driver = detectDriver();

    // Wrap data in save structure
    const saveData: SaveData<T> = {
      version: CURRENT_VERSION,
      data,
      timestamp: Date.now(),
    };

    // Encode data
    const encoded = encodeData(saveData);

    // Generate checksum
    const checksum = await generateChecksum(encoded);

    // Create backup before saving
    const existing = await load<T>();
    if (existing.success && existing.data) {
      const existingEncoded = encodeData({
        version: CURRENT_VERSION,
        data: existing.data,
        timestamp: Date.now(),
      });
      const existingChecksum = await generateChecksum(existingEncoded);
      await createBackup(existingEncoded, existingChecksum);
    }

    // Save to storage
    if (driver === 'indexeddb') {
      try {
        await saveToIndexedDB(SAVE_KEY, encoded, checksum);
        return { success: true };
      } catch (error) {
        // Fallback to localStorage on error
        console.error('IndexedDB save failed, falling back to localStorage:', error);
        saveToLocalStorage(SAVE_KEY, encoded, checksum);
        return { success: true, usedFallback: true };
      }
    } else {
      saveToLocalStorage(SAVE_KEY, encoded, checksum);
      return { success: true };
    }
  } catch (error) {
    console.error('Save failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// LOAD OPERATION
// ============================================================================

/**
 * Load game data
 * 
 * @returns Result with loaded data or error
 */
export async function load<T>(): Promise<LoadResult<T>> {
  try {
    const driver = detectDriver();

    // Load from storage
    let stored: StoredData | null = null;
    
    if (driver === 'indexeddb') {
      try {
        stored = await loadFromIndexedDB(SAVE_KEY);
      } catch (error) {
        console.error('IndexedDB load failed, trying localStorage:', error);
        stored = loadFromLocalStorage(SAVE_KEY);
        if (stored) {
          console.log('Loaded from localStorage fallback');
        }
      }
    } else {
      stored = loadFromLocalStorage(SAVE_KEY);
    }

    if (!stored) {
      return {
        success: false,
        error: 'No save data found',
      };
    }

    // Verify checksum
    const isValid = await verifyChecksum(stored.value, stored.checksum);

    if (!isValid) {
      console.warn('Save corrupted, restoring backup.');
      
      // Attempt to restore from backup
      const backup = await restoreFromBackup();
      
      if (backup) {
        stored = backup;
      } else {
        return {
          success: false,
          error: 'Save corrupted and no valid backup found',
        };
      }
    }

    // Decode data
    const decoded = decodeData<SaveData<T>>(stored.value);

    // Migrate if needed
    const migrated = decoded.version < CURRENT_VERSION
      ? migrateSaveData(decoded)
      : decoded;

    return {
      success: true,
      data: migrated.data,
      restoredFromBackup: !isValid,
    };
  } catch (error) {
    console.error('Load failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// UTILITY OPERATIONS
// ============================================================================

/**
 * Check if save data exists
 */
export async function exists(): Promise<boolean> {
  try {
    const driver = detectDriver();
    
    if (driver === 'indexeddb') {
      return await existsInIndexedDB(SAVE_KEY);
    } else {
      return existsInLocalStorage(SAVE_KEY);
    }
  } catch (error) {
    return false;
  }
}

/**
 * Delete save data (and backups)
 */
export async function deleteSave(): Promise<SaveResult> {
  try {
    const driver = detectDriver();

    if (driver === 'indexeddb') {
      await deleteFromIndexedDB(SAVE_KEY);
      await pruneBackupsInIndexedDB(SAVE_KEY, 0); // Delete all backups
    } else {
      deleteFromLocalStorage(SAVE_KEY);
      pruneBackupsInLocalStorage(SAVE_KEY, 0);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Export save as JSON string (for manual backup)
 */
export async function exportSave<T>(): Promise<string | null> {
  const result = await load<T>();
  
  if (!result.success || !result.data) {
    return null;
  }

  const saveData: SaveData<T> = {
    version: CURRENT_VERSION,
    data: result.data,
    timestamp: Date.now(),
  };

  return JSON.stringify(saveData, null, 2);
}

/**
 * Import save from JSON string (for manual restore)
 */
export async function importSave<T>(json: string): Promise<SaveResult> {
  try {
    const saveData = JSON.parse(json) as SaveData<T>;
    
    // Migrate if needed
    const migrated = saveData.version < CURRENT_VERSION
      ? migrateSaveData(saveData)
      : saveData;

    return await save(migrated.data);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid save data',
    };
  }
}