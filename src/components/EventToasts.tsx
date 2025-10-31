"use client";

/**
 * EventToasts.tsx - Active Event Display Component
 *
 * Shows active random events as toast notifications with:
 * - Event name and description
 * - Countdown timer
 * - Visual indicator of event type
 * - Auto-remove when expired
 */

import { useState, useEffect } from "react";
import { RandomEvent } from "@/game/state";
import { formatCountdown } from "@/game/format";

interface EventToastsProps {
  events: RandomEvent[];
}

export function EventToasts({ events }: EventToastsProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: string): string => {
    switch (type) {
      case "followerMultiplier":
        return "🔥";
      case "clickMultiplier":
        return "⭐";
      case "generatorMultiplier":
        return "📈";
      default:
        return "✨";
    }
  };

  const getEventColor = (type: string): string => {
    switch (type) {
      case "followerMultiplier":
        return "from-orange-400 to-red-500";
      case "clickMultiplier":
        return "from-yellow-400 to-orange-500";
      case "generatorMultiplier":
        return "from-green-400 to-emerald-500";
      default:
        return "from-purple-400 to-pink-500";
    }
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full"
      role="region"
      aria-label="Active events"
      aria-live="polite"
    >
      {events.map((event) => {
        const timeRemaining = event.endTime
          ? Math.max(0, event.endTime - currentTime)
          : 0;
        const progress = event.endTime
          ? Math.max(
              0,
              Math.min(
                100,
                ((event.duration - timeRemaining) / event.duration) * 100,
              ),
            )
          : 0;

        return (
          <div
            key={event.id}
            className="
              toast-enter
              bg-surface border-2 border-accent
              rounded-lg shadow-2xl
              overflow-hidden
              motion-reduce:transition-none
              animate-scale-in
              transition-colors
            "
          >
            {/* Progress Bar */}
            <div className="relative h-1 bg-muted">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getEventColor(
                  event.effect.type,
                )} transition-all duration-1000 ease-linear`}
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-lg
                    bg-gradient-to-br ${getEventColor(event.effect.type)}
                    flex items-center justify-center text-2xl
                    motion-reduce:animate-none animate-pulse
                  `}
                  aria-hidden="true"
                >
                  {getEventIcon(event.effect.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold mb-1 text-foreground">{event.name}</h4>
                  <p className="text-xs text-muted mb-2">
                    {event.description}
                  </p>

                  {/* Timer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">
                      Time remaining:
                    </span>
                    <span
                      className="text-xs font-mono font-bold text-accent"
                      aria-label={`${Math.floor(timeRemaining / 1000)} seconds remaining`}
                    >
                      {formatCountdown(timeRemaining)}
                    </span>
                  </div>

                  {/* Effect */}
                  <div className="mt-2 px-2 py-1 rounded bg-accent/10 text-xs text-center font-semibold text-accent border border-accent/20">
                    ×{event.effect.multiplier.toFixed(1)} Multiplier
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
