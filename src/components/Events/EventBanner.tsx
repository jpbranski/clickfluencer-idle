"use client";

/**
 * EventBanner - Live-Ops Event Display Component
 * Phase 3: UI scaffolding (hidden when no active events)
 */

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveOpsEvent } from "@/data/events/types";
import { formatTimeRemaining } from "@/data/events/eventUtils";

interface EventBannerProps {
  event: LiveOpsEvent;
  onDismiss?: () => void;
}

export const EventBanner = memo(function EventBanner({ event, onDismiss }: EventBannerProps) {
  const endDate = new Date(event.endDate);
  const timeRemaining = formatTimeRemaining(endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-xl border-2 p-4 shadow-premium"
      style={{
        borderColor: event.banner?.color || "var(--accent)",
        backgroundColor: `rgb(from ${event.banner?.color || "var(--accent)"} r g b / 0.1)`,
      }}
    >
      {/* Animated background effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${event.banner?.color || "var(--accent)"}, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        {event.banner?.icon && (
          <div className="text-4xl flex-shrink-0">
            {event.banner.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-lg" style={{ color: event.banner?.color || "var(--accent)" }}>
              {event.name}
            </h3>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-muted hover:text-foreground transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                ✕
              </button>
            )}
          </div>

          <p className="text-sm text-muted mb-2 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Time remaining */}
            <span
              className="px-2 py-1 rounded font-mono font-semibold"
              style={{
                backgroundColor: `rgb(from ${event.banner?.color || "var(--accent)"} r g b / 0.2)`,
                color: event.banner?.color || "var(--accent)",
              }}
            >
              ⏱ {timeRemaining}
            </span>

            {/* Event effects */}
            {event.effects?.productionMultiplier && event.effects.productionMultiplier > 1 && (
              <span className="text-muted">
                🚀 {event.effects.productionMultiplier}x Production
              </span>
            )}
            {event.effects?.awardDropMultiplier && event.effects.awardDropMultiplier > 1 && (
              <span className="text-muted">
                💎 {event.effects.awardDropMultiplier}x Awards
              </span>
            )}
            {event.effects?.prestigeMultiplier && event.effects.prestigeMultiplier > 1 && (
              <span className="text-muted">
                ⭐ {event.effects.prestigeMultiplier}x Prestige
              </span>
            )}
            {event.effects?.costMultiplier && event.effects.costMultiplier < 1 && (
              <span className="text-muted">
                💰 {Math.round((1 - event.effects.costMultiplier) * 100)}% Off
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

interface EventBannerListProps {
  events: LiveOpsEvent[];
  onDismissEvent?: (eventId: string) => void;
}

/**
 * EventBannerList - Container for multiple event banners
 * Automatically hidden when events array is empty
 */
export const EventBannerList = memo(function EventBannerList({
  events,
  onDismissEvent,
}: EventBannerListProps) {
  if (events.length === 0) {
    return null; // Hidden when no active events
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <EventBanner
            key={event.id}
            event={event}
            onDismiss={onDismissEvent ? () => onDismissEvent(event.id) : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});
