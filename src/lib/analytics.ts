/**
 * Local Analytics Layer
 * Phase 3: Privacy-first local analytics (no network calls)
 */

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data?: Record<string, any>;
}

interface AnalyticsSession {
  startTime: number;
  endTime?: number;
  clickCount: number;
  upgradesPurchased: string[];
  prestigeCount: number;
  pagesVisited: string[];
}

interface AnalyticsData {
  sessions: AnalyticsSession[];
  totalClicks: number;
  totalPrestige: number;
  ftueDropOff?: string; // Step where user left tutorial
  interactions: Record<string, number>;
  lastUpdated: number;
}

const STORAGE_KEY = "clickfluencer_analytics";
const MAX_SESSIONS = 100; // Keep last 100 sessions

export class LocalAnalytics {
  private currentSession: AnalyticsSession | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.startSession();
    }
  }

  private getStoredData(): AnalyticsData {
    if (typeof window === "undefined") {
      return this.createEmptyData();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return this.createEmptyData();
      return JSON.parse(stored);
    } catch {
      return this.createEmptyData();
    }
  }

  private saveData(data: AnalyticsData): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save analytics:", error);
    }
  }

  private createEmptyData(): AnalyticsData {
    return {
      sessions: [],
      totalClicks: 0,
      totalPrestige: 0,
      interactions: {},
      lastUpdated: Date.now(),
    };
  }

  startSession(): void {
    this.currentSession = {
      startTime: Date.now(),
      clickCount: 0,
      upgradesPurchased: [],
      prestigeCount: 0,
      pagesVisited: [typeof window !== "undefined" ? window.location.pathname : "/"],
    };
  }

  endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    const data = this.getStoredData();

    data.sessions.push(this.currentSession);
    // Keep only last N sessions
    if (data.sessions.length > MAX_SESSIONS) {
      data.sessions = data.sessions.slice(-MAX_SESSIONS);
    }

    data.lastUpdated = Date.now();
    this.saveData(data);
    this.currentSession = null;
  }

  trackClick(): void {
    if (!this.currentSession) this.startSession();
    if (this.currentSession) {
      this.currentSession.clickCount++;
    }

    const data = this.getStoredData();
    data.totalClicks++;
    data.lastUpdated = Date.now();
    this.saveData(data);
  }

  trackUpgrade(upgradeId: string): void {
    if (!this.currentSession) this.startSession();
    if (this.currentSession) {
      this.currentSession.upgradesPurchased.push(upgradeId);
    }

    this.trackInteraction(`upgrade_${upgradeId}`);
  }

  trackPrestige(): void {
    if (!this.currentSession) this.startSession();
    if (this.currentSession) {
      this.currentSession.prestigeCount++;
    }

    const data = this.getStoredData();
    data.totalPrestige++;
    data.lastUpdated = Date.now();
    this.saveData(data);

    this.trackInteraction("prestige");
  }

  trackPageVisit(path: string): void {
    if (!this.currentSession) this.startSession();
    if (this.currentSession && !this.currentSession.pagesVisited.includes(path)) {
      this.currentSession.pagesVisited.push(path);
    }

    this.trackInteraction(`page_${path}`);
  }

  trackFTUEStep(step: string): void {
    const data = this.getStoredData();
    data.ftueDropOff = step;
    data.lastUpdated = Date.now();
    this.saveData(data);
  }

  completeFTUE(): void {
    const data = this.getStoredData();
    delete data.ftueDropOff;
    data.lastUpdated = Date.now();
    this.saveData(data);
  }

  trackInteraction(key: string, increment: number = 1): void {
    const data = this.getStoredData();
    data.interactions[key] = (data.interactions[key] || 0) + increment;
    data.lastUpdated = Date.now();
    this.saveData(data);
  }

  getStats() {
    const data = this.getStoredData();
    const completedSessions = data.sessions.filter((s) => s.endTime);

    const totalSessionTime = completedSessions.reduce(
      (sum, s) => sum + ((s.endTime || s.startTime) - s.startTime),
      0
    );

    const avgSessionTime =
      completedSessions.length > 0 ? totalSessionTime / completedSessions.length : 0;

    const clicksPerMinute =
      totalSessionTime > 0 ? (data.totalClicks / (totalSessionTime / 60000)) : 0;

    return {
      totalSessions: data.sessions.length,
      totalClicks: data.totalClicks,
      totalPrestige: data.totalPrestige,
      avgSessionTime,
      clicksPerMinute,
      ftueDropOff: data.ftueDropOff,
      topInteractions: Object.entries(data.interactions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    };
  }

  clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.currentSession = null;
  }
}

// Global instance
export const analytics = new LocalAnalytics();
