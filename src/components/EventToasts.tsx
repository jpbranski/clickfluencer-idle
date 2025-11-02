"use client";

/**
 * EventToasts.tsx - Active Event Display Component
 *
 * Shows active random events as toast notifications with:
 * - Event name and description
 * - Countdown timer
 * - Visual indicator of event type
 * - Auto-remove when expired
 * - Close button to dismiss (event stays active)
 */

import { useState, useEffect } from "react";
import { RandomEvent } from "@/game/state";
import { formatCountdown } from "@/game/format";

interface EventToastsProps {
  events: RandomEvent[];
}

export function EventToasts({ events }: EventToastsProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [dismissedEventIds, setDismissedEventIds] = useState<Set<string>>(new Set());

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Clean up dismissed events that are no longer active
  useEffect(() => {
    const activeEventIds = new Set(events.map((e) => e.id));
    setDismissedEventIds((prev) => {
      const updated = new Set(prev);
      let changed = false;
      for (const id of prev) {
        if (!activeEventIds.has(id)) {
          updated.delete(id);
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, [events]);

  const handleDismissEvent = (eventId: string) => {
    setDismissedEventIds((prev) => new Set(prev).add(eventId));
  };

  // Filter out dismissed events
  const visibleEvents = events.filter((event) => !dismissedEventIds.has(event.id));

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

  if (visibleEvents.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full"
      role="region"
      aria-label="Active events"
      aria-live="polite"
    >
      {visibleEvents.map((event) => {
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
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-foreground">{event.name}</h4>
                    {/* Close Button */}
                    <button
                      onClick={() => handleDismissEvent(event.id)}
                      className="flex-shrink-0 w-5 h-5 rounded hover:bg-surface/50 flex items-center justify-center transition-colors"
                      aria-label="Dismiss event notification"
                      title="Dismiss (event keeps running)"
                    >
                      <svg
                        className="w-4 h-4 text-muted hover:text-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
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
