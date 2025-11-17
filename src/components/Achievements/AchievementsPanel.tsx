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

  // Tier-based rarity colors (Option C spec)
  const getTierColor = (tier?: number) => {
    if (!tier) return "border-border/50";
    switch (tier) {
      case 1: return "border-slate-500/40"; // Common
      case 2: return "border-emerald-500/40"; // Uncommon
      case 3: return "border-blue-500/40"; // Rare
      case 4: return "border-purple-500/40"; // Epic
      default: return "border-border/50";
    }
  };

  const getTierBadgeColor = (tier?: number) => {
    if (!tier) return "bg-accent/20 border-accent/30 text-accent";
    switch (tier) {
      case 1: return "bg-slate-500/20 border-slate-500/40 text-slate-300";
      case 2: return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
      case 3: return "bg-blue-500/20 border-blue-500/40 text-blue-300";
      case 4: return "bg-purple-500/20 border-purple-500/40 text-purple-300";
      default: return "bg-accent/20 border-accent/30 text-accent";
    }
  };

  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 transition-all
        ${
          unlocked
            ? `bg-gradient-to-br from-surface to-surface/50 ${getTierColor(tier)} shadow-md hover:shadow-lg ring-1 ring-success/10`
            : `bg-surface/30 ${getTierColor(tier)} hover:border-opacity-70`
        }
        ${unlocked ? "hover:scale-[1.01]" : ""}
      `}
      style={unlocked ? {
        boxShadow: "0 0 20px rgb(from var(--success) r g b / 0.15), 0 4px 10px rgb(0 0 0 / 0.15)"
      } : undefined}
    >
      {/* Lock overlay for locked achievements - only blur for hidden/secret achievements */}
      {!unlocked && (
        <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${hidden ? 'bg-background/75 backdrop-blur-[2px]' : 'bg-background/40'} z-10`}>
          <span className="text-5xl opacity-30">🔒</span>
        </div>
      )}

      {/* Tier Badge - positioned to not overlap icon */}
      {tier && (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md ${getTierBadgeColor(tier)} border z-20`}>
          <span className="text-[10px] font-bold">Tier {tier}</span>
        </div>
      )}

      {/* Category Badge */}
      <div className="absolute top-2 left-2 text-sm opacity-60 z-20">
        {CATEGORY_ICONS[category]}
      </div>

      <div className="text-center pt-7 pb-2">
        {/* Icon - larger and with secret achievement effect */}
        <div
          className={`text-6xl mb-3 ${hidden && !unlocked ? "opacity-30 grayscale" : ""}`}
          style={hidden && !unlocked ? { filter: "grayscale(100%) opacity(0.3)" } : undefined}
        >
          {displayIcon}
        </div>

        {/* Name */}
        <h3 className={`text-base font-bold mb-2 px-2 ${unlocked ? "text-foreground" : "text-muted"}`}>
          {displayName}
        </h3>

        {/* Requirement - Labeled clearly for non-hidden achievements */}
        {displayDescription && !hidden && (
          <div className="px-3 py-2 bg-surface/40 rounded-lg mx-2 mb-2">
            <p className="text-[10px] uppercase tracking-wider text-accent font-semibold mb-1">
              Requirement
            </p>
            <p className={`text-xs leading-relaxed ${unlocked ? "text-muted" : "text-foreground/80"}`}>
              {displayDescription}
            </p>
          </div>
        )}

        {/* Description for hidden achievements (once unlocked) */}
        {displayDescription && hidden && unlocked && (
          <div className="px-2">
            <p className="text-xs leading-relaxed text-muted">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Secret achievement placeholder */}
        {hidden && !unlocked && (
          <p className="text-xs text-muted/40 italic px-2">
            Secret Achievement
          </p>
        )}
      </div>

      {/* Unlocked checkmark indicator */}
      {unlocked && (
        <div className="absolute bottom-2 right-2 text-success z-20 bg-success/10 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-sm font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
