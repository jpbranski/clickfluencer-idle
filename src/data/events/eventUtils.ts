/**
 * Live-Ops Event System - Utilities
 * Phase 3: Foundation framework
 */

import { LiveOpsEvent, EventStatus, EventState } from "./types";
import eventsData from "./events.json";

/**
 * Get all events from the data file
 */
export function getAllEvents(): LiveOpsEvent[] {
  return eventsData as LiveOpsEvent[];
}

/**
 * Get the current status of an event based on dates
 */
export function getEventStatus(event: LiveOpsEvent, now: Date = new Date()): EventStatus {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  if (now < startDate) {
    return "upcoming";
  } else if (now > endDate) {
    return "ended";
  } else {
    return "active";
  }
}

/**
 * Get all currently active events
 */
export function getActiveEvents(now: Date = new Date()): LiveOpsEvent[] {
  return getAllEvents()
    .filter(event => getEventStatus(event, now) === "active")
    .sort((a, b) => b.priority - a.priority); // Higher priority first
}

/**
 * Get upcoming events (sorted by start date)
 */
export function getUpcomingEvents(now: Date = new Date()): LiveOpsEvent[] {
  return getAllEvents()
    .filter(event => getEventStatus(event, now) === "upcoming")
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

/**
 * Get events that should show banners
 */
export function getBannerEvents(now: Date = new Date()): LiveOpsEvent[] {
  return getActiveEvents(now).filter(event => event.showBanner);
}

/**
 * Get a specific event by ID
 */
export function getEventById(eventId: string): LiveOpsEvent | undefined {
  return getAllEvents().find(event => event.id === eventId);
}

/**
 * Calculate total production multiplier from all active events
 */
export function getTotalProductionMultiplier(now: Date = new Date()): number {
  const activeEvents = getActiveEvents(now);
  return activeEvents.reduce((total, event) => {
    return total * (event.effects?.productionMultiplier || 1);
  }, 1);
}

/**
 * Calculate total award drop multiplier from all active events
 */
export function getTotalAwardMultiplier(now: Date = new Date()): number {
  const activeEvents = getActiveEvents(now);
  return activeEvents.reduce((total, event) => {
    return total * (event.effects?.awardDropMultiplier || 1);
  }, 1);
}

/**
 * Calculate total prestige multiplier from all active events
 */
export function getTotalPrestigeMultiplier(now: Date = new Date()): number {
  const activeEvents = getActiveEvents(now);
  return activeEvents.reduce((total, event) => {
    return total * (event.effects?.prestigeMultiplier || 1);
  }, 1);
}

/**
 * Calculate total cost multiplier from all active events
 */
export function getTotalCostMultiplier(now: Date = new Date()): number {
  const activeEvents = getActiveEvents(now);
  return activeEvents.reduce((total, event) => {
    return total * (event.effects?.costMultiplier || 1);
  }, 1);
}

/**
 * Check if player meets event conditions
 */
export function meetsEventConditions(
  event: LiveOpsEvent,
  playerState: {
    totalCreds: number;
    prestigeLevel: number;
    achievements: string[];
  }
): boolean {
  if (!event.conditions || event.conditions.length === 0) {
    return true; // No conditions = always accessible
  }

  return event.conditions.every(condition => {
    switch (condition.type) {
      case "prestige_level":
        return compareValues(playerState.prestigeLevel, condition.value as number, condition.operator || ">=");
      case "total_creds":
        return compareValues(playerState.totalCreds, condition.value as number, condition.operator || ">=");
      case "achievement":
        return playerState.achievements.includes(condition.value as string);
      default:
        return true;
    }
  });
}

/**
 * Helper to compare values with operators
 */
function compareValues(a: number, b: number, operator: ">=" | "<=" | "==" | "!="): boolean {
  switch (operator) {
    case ">=": return a >= b;
    case "<=": return a <= b;
    case "==": return a === b;
    case "!=": return a !== b;
    default: return false;
  }
}

/**
 * Format time remaining until event starts/ends
 */
export function formatTimeRemaining(targetDate: Date, now: Date = new Date()): string {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
