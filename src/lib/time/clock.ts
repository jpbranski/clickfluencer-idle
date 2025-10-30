/**
 * clock.ts - Time Utilities
 * 
 * Provides time-related utilities including:
 * - Current timestamp helpers
 * - Elapsed time calculation
 * - Visibility state tracking (pause when tab hidden)
 * 
 * Connected to:
 * - engine.ts: Used for tick timing and offline calculation
 * - storage.ts: Used for save timestamps
 */

// ============================================================================
// TIME FUNCTIONS
// ============================================================================

/**
 * Get current timestamp in milliseconds
 * 
 * @returns Current time in ms since epoch
 */
export function now(): number {
  return Date.now();
}

/**
 * Calculate elapsed time between two timestamps
 * 
 * @param start - Start timestamp (ms)
 * @param end - End timestamp (ms), defaults to now
 * @returns Elapsed time in milliseconds
 */
export function elapsed(start: number, end: number = now()): number {
  return Math.max(0, end - start);
}

/**
 * Convert milliseconds to seconds
 * 
 * @param ms - Milliseconds
 * @returns Seconds (with decimals)
 */
export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/**
 * Convert seconds to milliseconds
 * 
 * @param seconds - Seconds
 * @returns Milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Get time components from milliseconds
 * 
 * @param ms - Milliseconds
 * @returns Object with days, hours, minutes, seconds, milliseconds
 */
export function getTimeComponents(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
} {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  const milliseconds = ms % 1000;
  
  return { days, hours, minutes, seconds, milliseconds };
}

// ============================================================================
// VISIBILITY STATE TRACKING
// ============================================================================

export type VisibilityChangeCallback = (isVisible: boolean, timeHidden: number) => void;

/**
 * Visibility state manager
 * Tracks when tab/window is hidden and calculates time away
 */
export class VisibilityTracker {
  private isVisible: boolean = true;
  private hiddenTime: number | null = null;
  private listeners: Set<VisibilityChangeCallback> = new Set();
  private visibilityChangeHandler: (() => void) | null = null;

  constructor() {
    this.isVisible = !document.hidden;
  }

  /**
   * Start tracking visibility changes
   */
  public start(): void {
    if (this.visibilityChangeHandler) return;

    this.visibilityChangeHandler = () => {
      this.handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    
    // Also listen for page unload/beforeunload
    window.addEventListener('beforeunload', () => {
      if (this.isVisible) {
        this.handleVisibilityChange();
      }
    });
  }

  /**
   * Stop tracking visibility changes
   */
  public stop(): void {
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
  }

  /**
   * Handle visibility change event
   */
  private handleVisibilityChange(): void {
    const nowVisible = !document.hidden;
    
    if (nowVisible === this.isVisible) return;

    if (nowVisible) {
      // Tab became visible - calculate time hidden
      const timeHidden = this.hiddenTime ? elapsed(this.hiddenTime) : 0;
      this.isVisible = true;
      this.hiddenTime = null;
      this.notifyListeners(true, timeHidden);
    } else {
      // Tab became hidden - record time
      this.isVisible = false;
      this.hiddenTime = now();
      this.notifyListeners(false, 0);
    }
  }

  /**
   * Subscribe to visibility changes
   * 
   * @param callback - Function to call on visibility change
   * @returns Unsubscribe function
   */
  public onChange(callback: VisibilityChangeCallback): () => void {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of visibility change
   */
  private notifyListeners(isVisible: boolean, timeHidden: number): void {
    this.listeners.forEach(listener => {
      try {
        listener(isVisible, timeHidden);
      } catch (error) {
        console.error('Error in visibility change listener:', error);
      }
    });
  }

  /**
   * Check if currently visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Get time since hidden (if currently hidden)
   */
  public getTimeSinceHidden(): number {
    if (this.isVisible || !this.hiddenTime) return 0;
    return elapsed(this.hiddenTime);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let visibilityTrackerInstance: VisibilityTracker | null = null;

/**
 * Get singleton visibility tracker
 */
export function getVisibilityTracker(): VisibilityTracker {
  if (!visibilityTrackerInstance) {
    visibilityTrackerInstance = new VisibilityTracker();
  }
  return visibilityTrackerInstance;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sleep for specified milliseconds
 * Useful for delays and testing
 * 
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a debounced function
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Create a throttled function
 * 
 * @param fn - Function to throttle
 * @param delay - Delay in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const nowTime = now();
    
    if (nowTime - lastCall >= delay) {
      lastCall = nowTime;
      fn(...args);
    }
  };
}