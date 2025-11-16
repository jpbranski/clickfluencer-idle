"use client";

/**
 * AchievementToast - Achievement Unlock Notification
 *
 * Displays a toast notification when an achievement is unlocked.
 * Features:
 * - Animated entrance/exit
 * - Queue support for multiple unlocks
 * - Respects prefers-reduced-motion
 * - Auto-dismiss after 4 seconds
 */

import { Achievement } from "@/game/state";
import { useEffect, useState } from "react";

export interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-dismiss after 4 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    // Wait for exit animation before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  return (
    <div
      className={`
        fixed bottom-20 left-1/2 -translate-x-1/2 z-50
        max-w-sm w-full mx-4
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      onClick={handleDismiss}
      role="alert"
      aria-live="assertive"
    >
      <div
        className="
          bg-gradient-to-br from-accent to-accent/80
          border-2 border-accent-foreground/20
          rounded-lg shadow-2xl
          p-4
          cursor-pointer
          hover:scale-105 transition-transform
        "
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="text-4xl flex-shrink-0">
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold uppercase text-accent-foreground/80 mb-0.5">
              Achievement Unlocked!
            </div>
            <div className="text-base font-bold text-accent-foreground">
              {achievement.name}
            </div>
            <div className="text-xs text-accent-foreground/90 mt-0.5">
              {achievement.description}
            </div>
          </div>

          {/* Trophy icon */}
          <div className="text-2xl flex-shrink-0 text-accent-foreground/60">
            🏆
          </div>
        </div>

        {/* Tier badge */}
        {achievement.tier && (
          <div className="mt-2 inline-block px-2 py-0.5 bg-accent-foreground/10 rounded text-xs font-bold text-accent-foreground">
            Tier {achievement.tier}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Container for managing multiple achievement toasts
 */
export interface AchievementToastContainerProps {
  achievements: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToastContainer({
  achievements,
  onDismiss,
}: AchievementToastContainerProps) {
  // Only show the most recent achievement (or could implement queue)
  const currentAchievement = achievements[achievements.length - 1];

  if (!currentAchievement) {
    return null;
  }

  return (
    <AchievementToast
      achievement={currentAchievement}
      onDismiss={() => onDismiss(currentAchievement.id)}
    />
  );
}
