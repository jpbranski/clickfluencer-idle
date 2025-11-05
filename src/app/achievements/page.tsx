"use client";

/**
 * Achievements Page
 *
 * Displays cosmetic achievements (per save slot).
 * Placeholder trophies for v1.0.0 - auto-unlock logic to be implemented later.
 */

import { useGame } from "@/hooks/useGame";
import { Achievement } from "@/game/state";

export default function AchievementsPage() {
  const { state } = useGame();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const achievements = state.achievements || [];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-muted">
            {unlockedCount} / {achievements.length} unlocked
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-accent hover:underline">
            Back to Game
          </a>
        </div>
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const { id, name, description, unlocked, icon } = achievement;

  return (
    <div
      className={`
        relative p-6 rounded-lg border
        ${unlocked
          ? "bg-surface border-accent shadow-lg"
          : "bg-surface/50 border-border opacity-60"
        }
        transition-all hover:scale-105
      `}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      <div className="text-center">
        <div className="text-5xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}
