/**
 * engine.ts - Main Game Engine
 *
 * This module orchestrates the entire game loop including:
 * - Tick loop (250-500ms intervals)
 * - Random event scheduling
 * - Offline progress calculation
 * - Pub/sub event system for state updates
 *
 * Connected to:
 * - state.ts: Manages game state
 * - actions.ts: Executes game actions
 * - prestige.ts: Calculates offline gains with prestige bonuses
 * - UI components: Subscribe to state changes
 *
 * Architecture:
 * - Engine maintains single source of truth (GameState)
 * - All mutations go through actions
 * - Subscribers notified on every state change
 * - Persistent through IndexedDB (handled externally)
 */

import { GameState, createInitialState, getFollowersPerSecond } from "./state";
import { tick, applyEvent, ActionResult } from "./actions";
import { calculateReputationBonus } from "./prestige";

// ============================================================================
// CONSTANTS
// ============================================================================

export const TICK_INTERVAL = 250; // milliseconds (4 ticks per second)
export const OFFLINE_PROGRESS_CAP = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
export const EVENT_CHECK_INTERVAL = 30000; // Check for events every 30 seconds
export const EVENT_CHANCE = 0.05; // 5% chance per check

// ============================================================================
// TYPES
// ============================================================================

export type StateChangeListener = (state: GameState) => void;
export type EventListener = (eventType: string, data: unknown) => void;

export interface OfflineProgress {
  timeAway: number;
  timeProcessed: number;
  followersGained: number;
  wasCapped: boolean;
}

export interface RandomEventDefinition {
  id: string;
  name: string;
  description: string;
  duration: number;
  weight: number; // Probability weight
  effect: {
    type: "followerMultiplier" | "clickMultiplier" | "generatorMultiplier";
    multiplier: number;
  };
}

// ============================================================================
// RANDOM EVENT DEFINITIONS
// ============================================================================

const RANDOM_EVENTS: RandomEventDefinition[] = [
  {
    id: "viral_post",
    name: "🔥 Viral Post",
    description: "Your post went viral! 3x followers for 60 seconds",
    duration: 60000,
    weight: 10,
    effect: { type: "followerMultiplier", multiplier: 3 },
  },
  {
    id: "trending_topic",
    name: "📈 Trending Topic",
    description: "You jumped on a trending topic! 2x production for 2 minutes",
    duration: 120000,
    weight: 15,
    effect: { type: "generatorMultiplier", multiplier: 2 },
  },
  {
    id: "celebrity_mention",
    name: "⭐ Celebrity Mention",
    description: "A celebrity mentioned you! 5x click power for 30 seconds",
    duration: 30000,
    weight: 5,
    effect: { type: "clickMultiplier", multiplier: 5 },
  },
  {
    id: "algorithm_boost",
    name: "🚀 Algorithm Boost",
    description: "The algorithm favors you! 2x all production for 90 seconds",
    duration: 90000,
    weight: 8,
    effect: { type: "followerMultiplier", multiplier: 2 },
  },
  {
    id: "sponsored_post",
    name: "💰 Sponsored Post",
    description: "Sponsored content bonus! 4x followers for 45 seconds",
    duration: 45000,
    weight: 12,
    effect: { type: "followerMultiplier", multiplier: 4 },
  },
];

// ============================================================================
// GAME ENGINE CLASS
// ============================================================================

export class GameEngine {
  private state: GameState;
  private tickInterval: NodeJS.Timeout | null = null;
  private eventCheckInterval: NodeJS.Timeout | null = null;
  private stateListeners: Set<StateChangeListener> = new Set();
  private eventListeners: Map<string, Set<EventListener>> = new Map();
  private isRunning = false;
  private lastTickTime = Date.now();
  private lastEventCheckTime = Date.now();

  constructor(initialState?: GameState) {
    this.state = initialState || createInitialState();
  }

  // ==========================================================================
  // LIFECYCLE METHODS
  // ==========================================================================

  /**
   * Start the game engine
   * - Begins tick loop
   * - Starts event checking
   * - Calculates offline progress if applicable
   */
  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTickTime = Date.now();
    this.lastEventCheckTime = Date.now();

    // Calculate offline progress if player was away
    this.calculateOfflineProgress();

    // Start tick loop
    this.tickInterval = setInterval(() => {
      this.processTick();
    }, TICK_INTERVAL);

    // Start event checking loop
    this.eventCheckInterval = setInterval(() => {
      this.checkForRandomEvent();
    }, EVENT_CHECK_INTERVAL);

    this.emit("engine:started", { timestamp: Date.now() });
  }

  /**
   * Stop the game engine
   * - Stops tick loop
   * - Stops event checking
   * - Updates last save time
   */
  public stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    if (this.eventCheckInterval) {
      clearInterval(this.eventCheckInterval);
      this.eventCheckInterval = null;
    }

    // Update last save time
    this.state = {
      ...this.state,
      lastSaveTime: Date.now(),
    };

    this.emit("engine:stopped", { timestamp: Date.now() });
  }

  /**
   * Pause the game (stops tick but keeps engine ready)
   */
  public pause(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    this.emit("engine:paused", { timestamp: Date.now() });
  }

  /**
   * Resume the game
   */
  public resume(): void {
    if (!this.isRunning) return;

    this.lastTickTime = Date.now();
    this.tickInterval = setInterval(() => {
      this.processTick();
    }, TICK_INTERVAL);

    this.emit("engine:resumed", { timestamp: Date.now() });
  }

  // ==========================================================================
  // TICK PROCESSING
  // ==========================================================================

  /**
   * Process a single game tick
   * - Calculates delta time since last tick
   * - Updates game state via tick action
   * - Notifies subscribers
   */
  private processTick(): void {
    const now = Date.now();
    const deltaTime = now - this.lastTickTime;
    this.lastTickTime = now;

    // Update state through tick action
    this.state = tick(this.state, deltaTime);

    // Update play time
    this.state = {
      ...this.state,
      stats: {
        ...this.state.stats,
        playTime: this.state.stats.playTime + deltaTime,
      },
    };

    // Notify subscribers
    this.notifyStateChange();
  }

  // ==========================================================================
  // OFFLINE PROGRESS
  // ==========================================================================

  /**
   * Calculate and apply offline progress
   * - Caps at 8 hours
   * - Applies reputation bonus to production
   * - Shows notification with results
   */
  private calculateOfflineProgress(): OfflineProgress {
    const now = Date.now();
    const timeAway = now - this.state.lastSaveTime;

    // No offline progress if less than 1 minute away
    if (timeAway < 60000) {
      return {
        timeAway: 0,
        timeProcessed: 0,
        followersGained: 0,
        wasCapped: false,
      };
    }

    // Cap offline time to 8 hours
    const timeProcessed = Math.min(timeAway, OFFLINE_PROGRESS_CAP);
    const wasCapped = timeAway > OFFLINE_PROGRESS_CAP;

    // Calculate production (with reputation bonus applied through getFollowersPerSecond)
    const followersPerSecond = getFollowersPerSecond(this.state);
    const secondsElapsed = timeProcessed / 1000;
    const followersGained = followersPerSecond * secondsElapsed;

    // Apply offline gains
    this.state = {
      ...this.state,
      followers: this.state.followers + followersGained,
      stats: {
        ...this.state.stats,
        totalFollowersEarned:
          this.state.stats.totalFollowersEarned + followersGained,
        playTime: this.state.stats.playTime + timeProcessed,
        lastTickTime: now,
      },
      lastSaveTime: now,
    };

    const result: OfflineProgress = {
      timeAway,
      timeProcessed,
      followersGained,
      wasCapped,
    };

    // Emit event for UI notification
    if (followersGained > 0) {
      this.emit("offline:progress", result);
    }

    this.notifyStateChange();

    return result;
  }

  // ==========================================================================
  // RANDOM EVENTS
  // ==========================================================================

  /**
   * Check if a random event should trigger
   * - 5% chance per check (every 30 seconds)
   * - Selects event based on weighted probability
   */
  private checkForRandomEvent(): void {
    // Don't spawn events if already at max (3)
    if (this.state.activeEvents.length >= 3) return;

    // 5% chance to trigger event
    if (Math.random() > EVENT_CHANCE) return;

    // Select random event based on weight
    const event = this.selectRandomEvent();
    if (!event) return;

    // Apply event
    this.state = applyEvent(this.state, {
      id: event.id,
      name: event.name,
      description: event.description,
      duration: event.duration,
      effect: event.effect,
      active: true,
      endTime: Date.now() + event.duration,
    });

    this.notifyStateChange();
    this.emit("event:started", event);
  }

  /**
   * Select a random event based on weighted probability
   */
  private selectRandomEvent(): RandomEventDefinition | null {
    const totalWeight = RANDOM_EVENTS.reduce(
      (sum, event) => sum + event.weight,
      0,
    );
    let random = Math.random() * totalWeight;

    for (const event of RANDOM_EVENTS) {
      random -= event.weight;
      if (random <= 0) {
        return event;
      }
    }

    return RANDOM_EVENTS[0]; // Fallback
  }

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  /**
   * Get current game state (read-only)
   */
  public getState(): Readonly<GameState> {
    return this.state;
  }

  /**
   * Set game state (use carefully - prefer actions)
   */
  public setState(newState: GameState): void {
    this.state = newState;
    this.notifyStateChange();
  }

  /**
   * Execute an action and update state
   */
  public executeAction(
    action: (state: GameState) => ActionResult,
  ): ActionResult {
    const result = action(this.state);

    if (result.success) {
      this.state = result.state;
      this.notifyStateChange();
    }

    if (result.message) {
      this.emit("action:executed", {
        success: result.success,
        message: result.message,
      });
    }

    return result;
  }

  // ==========================================================================
  // PUB/SUB SYSTEM
  // ==========================================================================

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  public subscribe(listener: StateChangeListener): () => void {
    this.stateListeners.add(listener);

    // Call immediately with current state
    listener(this.state);

    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * Subscribe to specific events
   * Returns unsubscribe function
   */
  public on(eventType: string, listener: EventListener): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }

    this.eventListeners.get(eventType)!.add(listener);

    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   */
  private emit(eventType: string, data: unknown): void {
    const listeners = this.eventListeners.get(eventType);
    if (!listeners) return;

    listeners.forEach((listener) => {
      try {
        listener(eventType, data);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    });
  }

  /**
   * Notify all state change listeners
   */
  private notifyStateChange(): void {
    this.stateListeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (error) {
        console.error("Error in state change listener:", error);
      }
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Check if engine is running
   */
  public isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Get number of active subscribers
   */
  public getSubscriberCount(): number {
    return this.stateListeners.size;
  }

  /**
   * Force a save (updates lastSaveTime)
   */
  public forceSave(): void {
    this.state = {
      ...this.state,
      lastSaveTime: Date.now(),
    };
    this.emit("game:saved", { timestamp: Date.now() });
  }

  /**
   * Reset to initial state (for debugging/testing)
   */
  public reset(): void {
    this.state = createInitialState();
    this.notifyStateChange();
    this.emit("game:reset", { timestamp: Date.now() });
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

// Export a singleton instance for use throughout the app
let engineInstance: GameEngine | null = null;

export function getGameEngine(): GameEngine {
  if (!engineInstance) {
    engineInstance = new GameEngine();
  }
  return engineInstance;
}

export function createGameEngine(initialState?: GameState): GameEngine {
  engineInstance = new GameEngine(initialState);
  return engineInstance;
}
