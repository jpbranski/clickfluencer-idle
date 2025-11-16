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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Achievements</h2>
        <p className="text-sm text-muted">
          {unlockedCount} / {totalCount} unlocked
          {selectedCategory !== "all" && ` • ${filteredUnlockedCount} / ${filteredAchievements.length} in ${CATEGORY_LABELS[selectedCategory]}`}
        </p>
      </div>

      {/* Category Filter */}
      {achievements.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-muted hover:bg-surface/80 border border-border"
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
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface text-muted hover:bg-surface/80 border border-border"
                  }
                `}
              >
                {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]} ({categoryCount})
              </button>
            );
          })}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {/* Empty State */}
      {achievements.length === 0 && (
        <div className="text-center p-8 bg-surface rounded-lg border border-border">
          <div className="text-4xl mb-2">🏆</div>
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
  const displayDescription = hidden && !unlocked ? "Unlock to reveal" : description;
  const displayIcon = hidden && !unlocked ? "❓" : icon;

  return (
    <div
      className={`
        relative p-4 rounded-lg border
        ${
          unlocked
            ? "bg-gradient-to-br from-surface to-surface/50 border-accent shadow-lg ring-1 ring-accent/20"
            : "bg-surface/30 border-border/50"
        }
        transition-all hover:scale-[1.02] group
      `}
    >
      {/* Lock overlay for locked achievements */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-[2px]">
          <span className="text-4xl opacity-50">🔒</span>
        </div>
      )}

      {/* Tier Badge */}
      {tier && unlocked && (
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-accent/20 border border-accent/40">
          <span className="text-xs font-bold text-accent">Tier {tier}</span>
        </div>
      )}

      {/* Category Badge (for unlocked achievements) */}
      {unlocked && (
        <div className="absolute top-2 left-2 text-xs opacity-60">
          {CATEGORY_ICONS[category]}
        </div>
      )}

      <div className="text-center">
        <div className={`text-4xl mb-2 ${!unlocked && "opacity-40"}`}>{displayIcon}</div>
        <h3 className={`text-base font-bold mb-1 ${unlocked ? "text-foreground" : "text-muted"}`}>
          {displayName}
        </h3>
        <p className={`text-xs ${unlocked ? "text-muted" : "text-muted/60"}`}>
          {displayDescription}
        </p>
      </div>

      {/* Unlocked indicator */}
      {unlocked && (
        <div className="absolute bottom-2 right-2 text-success">
          <span className="text-lg">✓</span>
        </div>
      )}
    </div>
  );
}
