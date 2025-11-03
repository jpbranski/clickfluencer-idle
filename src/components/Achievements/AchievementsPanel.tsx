"use client";

/**
 * AchievementsPanel - Achievements Tab Content
 *
 * Displays achievement grid with 8-12 placeholder trophies.
 * Per-slot persistent data.
 */

import { Achievement } from "@/game/state";

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Achievements</h2>
        <p className="text-sm text-muted">
          {unlockedCount} / {achievements.length} unlocked
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center p-8 bg-surface rounded-lg border border-border">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-lg font-bold text-accent mb-2">
            Achievements Coming Soon
          </div>
          <div className="text-sm text-muted">
            Achievement tracking will be added in a future update
          </div>
        </div>
      )}
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const { name, description, unlocked, icon } = achievement;

  return (
    <div
      className={`
        relative p-4 rounded-lg border
        ${
          unlocked
            ? "bg-surface border-accent shadow-lg"
            : "bg-surface/50 border-border opacity-60"
        }
        transition-all hover:scale-105 group
      `}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
          <span className="text-3xl">🔒</span>
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <h3 className="text-base font-bold mb-1">{name}</h3>
        <p className="text-xs text-muted">{description}</p>
      </div>

      {/* Coming Soon hover tooltip */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="text-sm font-semibold text-muted">Coming Soon</span>
        </div>
      )}
    </div>
  );
}
