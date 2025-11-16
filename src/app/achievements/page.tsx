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

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
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
  const { name, description, unlocked, icon, hidden } = achievement;

  const displayName = hidden && !unlocked ? "???" : name;
  const displayDescription = hidden && !unlocked ? "" : description;
  const displayIcon = hidden && !unlocked ? "❓" : icon;

  return (
    <div
      className={`
        relative p-3 rounded-lg border transition-all
        ${
          unlocked
            ? "bg-gradient-to-br from-surface to-surface/50 border-accent/40 shadow-md hover:shadow-lg"
            : "bg-surface/30 border-border/50"
        }
        ${unlocked ? "hover:scale-[1.01]" : ""}
      `}
      style={unlocked ? {
        boxShadow: "0 0 16px rgb(from var(--success) r g b / 0.15), 0 4px 8px rgb(0 0 0 / 0.1)"
      } : undefined}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-[2px] z-10">
          <span className="text-4xl opacity-40">🔒</span>
        </div>
      )}

      <div className="text-center pt-6 pb-2">
        <div
          className={`text-5xl mb-2 ${hidden && !unlocked ? "opacity-30 grayscale" : ""}`}
          style={hidden && !unlocked ? { filter: "grayscale(100%) opacity(0.3)" } : undefined}
        >
          {displayIcon}
        </div>
        <h3 className={`text-sm font-bold mb-1.5 px-2 ${unlocked ? "text-foreground" : "text-muted"}`}>
          {displayName}
        </h3>
        {displayDescription && (
          <p className={`text-xs leading-relaxed px-2 ${unlocked ? "text-muted" : "text-muted/60"}`}>
            {displayDescription}
          </p>
        )}
        {hidden && !unlocked && (
          <p className="text-xs text-muted/40 italic px-2">???</p>
        )}
      </div>

      {unlocked && (
        <div className="absolute bottom-2 right-2 text-success z-20">
          <span className="text-base font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
