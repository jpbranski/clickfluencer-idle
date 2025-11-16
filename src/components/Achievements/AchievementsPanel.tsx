"use client";

/**
 * AchievementsPanel - Achievements Tab Content (Phase 2)
 *
 * Features:
 * - Category filtering
 * - Hidden achievements (show ??? until unlocked)
 * - Tier badges
 * - Progress summary
 * - Responsive grid layout
 */

import { Achievement, AchievementCategory } from "@/game/state";
import { useState } from "react";

interface AchievementsPanelProps {
  achievements: Achievement[];
}

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  progression: "Progression",
  currency: "Currency",
  generators: "Generators",
  clicks: "Clicks",
  prestige: "Prestige",
  meta: "Meta",
  hidden: "Hidden",
};

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  progression: "🎯",
  currency: "💰",
  generators: "🏭",
  clicks: "👆",
  prestige: "🔱",
  meta: "⏱️",
  hidden: "❓",
};

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | "all">("all");

  // Filter achievements by category
  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  // Calculate counts
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const filteredUnlockedCount = filteredAchievements.filter((a) => a.unlocked).length;

  // Get unique categories from achievements
  const categories: AchievementCategory[] = Array.from(
    new Set(achievements.map((a) => a.category))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 text-foreground">Achievements</h2>
        <p className="text-sm text-muted">
          {unlockedCount} / {totalCount} unlocked
          {selectedCategory !== "all" && ` • ${filteredUnlockedCount} / ${filteredAchievements.length} in ${CATEGORY_LABELS[selectedCategory]}`}
        </p>
      </div>

      {/* Category Filter - Centered pills */}
      {achievements.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface/50 text-muted hover:bg-surface border border-border"
              }
            `}
          >
            All ({totalCount})
          </button>
          {categories.map((category) => {
            const categoryCount = achievements.filter((a) => a.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface/50 text-muted hover:bg-surface border border-border"
                  }
                `}
              >
                {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]} ({categoryCount})
              </button>
            );
          })}
        </div>
      )}

      {/* Achievements Grid - 2 columns desktop, 1 on mobile */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Empty State */}
      {achievements.length === 0 && (
        <div className="text-center p-8 bg-surface/50 rounded-xl border border-border max-w-md mx-auto">
          <div className="text-5xl mb-3">🏆</div>
          <div className="text-lg font-bold text-accent mb-2">
            Achievements Loading...
          </div>
          <div className="text-sm text-muted">
            Your achievements will appear here
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
  const { name, description, unlocked, icon, hidden, tier, category } = achievement;

  // Hidden achievements show ??? until unlocked
  const displayName = hidden && !unlocked ? "???" : name;
  const displayDescription = hidden && !unlocked ? "" : description;
  const displayIcon = hidden && !unlocked ? "❓" : icon;

  return (
    <div
      className={`
        relative p-3 rounded-lg border transition-all
        ${
          unlocked
            ? "bg-gradient-to-br from-surface to-surface/50 border-accent/40 shadow-md hover:shadow-lg ring-1 ring-success/10"
            : "bg-surface/30 border-border/50 hover:border-border"
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

      {/* Tier Badge - positioned to not overlap icon */}
      {tier && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-accent/20 border border-accent/30 z-20">
          <span className="text-[10px] font-bold text-accent">T{tier}</span>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute top-2 left-2 text-xs opacity-50 z-20">
        {CATEGORY_ICONS[category]}
      </div>

      <div className="text-center pt-6 pb-2">
        {/* Icon - larger and with secret achievement effect */}
        <div
          className={`text-5xl mb-2 ${hidden && !unlocked ? "opacity-30 grayscale" : ""}`}
          style={hidden && !unlocked ? { filter: "grayscale(100%) opacity(0.3)" } : undefined}
        >
          {displayIcon}
        </div>

        {/* Name */}
        <h3 className={`text-sm font-bold mb-1.5 px-2 ${unlocked ? "text-foreground" : "text-muted"}`}>
          {displayName}
        </h3>

        {/* Requirement/Description */}
        {displayDescription && (
          <div className="px-2">
            <p className={`text-xs leading-relaxed ${unlocked ? "text-muted" : "text-muted/60"}`}>
              {displayDescription}
            </p>
          </div>
        )}

        {/* Secret achievement placeholder */}
        {hidden && !unlocked && (
          <p className="text-xs text-muted/40 italic px-2">
            ???
          </p>
        )}
      </div>

      {/* Unlocked checkmark indicator */}
      {unlocked && (
        <div className="absolute bottom-2 right-2 text-success z-20">
          <span className="text-base font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
