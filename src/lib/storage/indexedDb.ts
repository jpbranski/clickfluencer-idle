/**
 * indexedDb.ts - IndexedDB Storage Driver
 *
 * Primary storage driver using IndexedDB via the idb library.
 * Provides persistent storage with better performance than localStorage.
 *
 * Connected to:
 * - storage.ts: Called by storage orchestrator
 * - idb library: Wrapper for IndexedDB API
 */

import { openDB, IDBPDatabase } from "idb";

// ============================================================================
// CONSTANTS
// ============================================================================

const DB_NAME = "clickfluencer_idle";
const DB_VERSION = 1;
const STORE_NAME = "saves";
const BACKUP_STORE_NAME = "backups";

// ============================================================================
// TYPES
// ============================================================================

export interface StoredData {
  key: string;
  value: string;
  timestamp: number;
  checksum: string;
}

export interface BackupData {
  id: string;
  key: string;
  value: string;
  timestamp: number;
  checksum: string;
}

// ============================================================================
// DATABASE SETUP
// ============================================================================

let dbInstance: IDBPDatabase | null = null;

/**
 * Initialize IndexedDB connection
 * Creates object stores if they don't exist
 */
async function initDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create main save store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const saveStore = db.createObjectStore(STORE_NAME, {
            keyPath: "key",
          });
          saveStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        // Create backup store
        if (!db.objectStoreNames.contains(BACKUP_STORE_NAME)) {
          const backupStore = db.createObjectStore(BACKUP_STORE_NAME, {
            keyPath: "id",
          });
          backupStore.createIndex("key", "key", { unique: false });
          backupStore.createIndex("timestamp", "timestamp", { unique: false });
        }
      },
    });

    return dbInstance;
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw new Error("IndexedDB initialization failed");
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Save data to IndexedDB
 *
 * @param key - Storage key
 * @param value - Data to store (string)
 * @param checksum - Data checksum for integrity
 */
export async function saveToIndexedDB(
  key: string,
  value: string,
  checksum: string,
): Promise<void> {
  const db = await initDB();

  const data: StoredData = {
    key,
    value,
    timestamp: Date.now(),
    checksum,
  };

  await db.put(STORE_NAME, data);
}

/**
 * Load data from IndexedDB
 *
 * @param key - Storage key
 * @returns Stored data or null if not found
 */
export async function loadFromIndexedDB(
  key: string,
): Promise<StoredData | null> {
  try {
    const db = await initDB();
    const data = await db.get(STORE_NAME, key);
    return data || null;
  } catch (error) {
    console.error("Failed to load from IndexedDB:", error);
    return null;
  }
}

/**
 * Delete data from IndexedDB
 *
 * @param key - Storage key
 */
export async function deleteFromIndexedDB(key: string): Promise<void> {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
}

/**
 * Check if a key exists in IndexedDB
 *
 * @param key - Storage key
 * @returns True if exists, false otherwise
 */
export async function existsInIndexedDB(key: string): Promise<boolean> {
  try {
    const db = await initDB();
    const data = await db.get(STORE_NAME, key);
    return !!data;
  } catch (error) {
    return false;
  }
}

/**
 * Get all keys from IndexedDB
 *
 * @returns Array of all keys
 */
export async function getAllKeysFromIndexedDB(): Promise<string[]> {
  try {
    const db = await initDB();
    const keys = await db.getAllKeys(STORE_NAME);
    return keys as string[];
  } catch (error) {
    console.error("Failed to get keys from IndexedDB:", error);
    return [];
  }
}

// ============================================================================
// BACKUP OPERATIONS
// ============================================================================

/**
 * Save a backup to IndexedDB
 *
 * @param id - Backup ID
 * @param key - Original storage key
 * @param value - Data to backup
 * @param checksum - Data checksum
 */
export async function saveBackupToIndexedDB(
  id: string,
  key: string,
  value: string,
  checksum: string,
): Promise<void> {
  const db = await initDB();

  const backup: BackupData = {
    id,
    key,
    value,
    timestamp: Date.now(),
    checksum,
  };

  await db.put(BACKUP_STORE_NAME, backup);
}

/**
 * Load all backups for a key from IndexedDB
 *
 * @param key - Storage key
 * @returns Array of backups, sorted by timestamp (newest first)
 */
export async function loadBackupsFromIndexedDB(
  key: string,
): Promise<BackupData[]> {
  try {
    const db = await initDB();
    const index = db.transaction(BACKUP_STORE_NAME).store.index("key");
    const backups = await index.getAll(key);

    // Sort by timestamp descending (newest first)
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to load backups from IndexedDB:", error);
    return [];
  }
}

/**
 * Delete old backups, keeping only the most recent N
 *
 * @param key - Storage key
 * @param keepCount - Number of backups to keep (default 3)
 */
export async function pruneBackupsInIndexedDB(
  key: string,
  keepCount: number = 3,
): Promise<void> {
  try {
    const db = await initDB();
    const backups = await loadBackupsFromIndexedDB(key);

    // Delete backups beyond keepCount
    const toDelete = backups.slice(keepCount);

    for (const backup of toDelete) {
      await db.delete(BACKUP_STORE_NAME, backup.id);
    }
  } catch (error) {
    console.error("Failed to prune backups in IndexedDB:", error);
  }
}

/**
 * Delete all backups for a key
 *
 * @param key - Storage key
 */
export async function deleteBackupsFromIndexedDB(key: string): Promise<void> {
  try {
    const db = await initDB();
    const backups = await loadBackupsFromIndexedDB(key);

    for (const backup of backups) {
      await db.delete(BACKUP_STORE_NAME, backup.id);
    }
  } catch (error) {
    console.error("Failed to delete backups from IndexedDB:", error);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if IndexedDB is available
 *
 * @returns True if available, false otherwise
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}

/**
 * Get database size estimate (if available)
 *
 * @returns Estimated size in bytes or null
 */
export async function getIndexedDBSize(): Promise<number | null> {
  try {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Clear all data from IndexedDB (for testing/reset)
 */
export async function clearIndexedDB(): Promise<void> {
  try {
    const db = await initDB();
    await db.clear(STORE_NAME);
    await db.clear(BACKUP_STORE_NAME);
  } catch (error) {
    console.error("Failed to clear IndexedDB:", error);
    throw error;
  }
}

/**
 * Close database connection
 */
export function closeIndexedDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
