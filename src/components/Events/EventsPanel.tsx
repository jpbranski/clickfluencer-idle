"use client";

/**
 * EventsPanel - Full event management panel
 * Phase 3: Scaffolding for viewing active/upcoming events
 */

import { memo, useState, useEffect } from "react";
import { LiveOpsEvent, EventStatus } from "@/data/events/types";
import { getActiveEvents, getUpcomingEvents, getEventStatus, formatTimeRemaining } from "@/data/events/eventUtils";

export const EventsPanel = memo(function EventsPanel() {
  const [activeEvents, setActiveEvents] = useState<LiveOpsEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<LiveOpsEvent[]>([]);

  useEffect(() => {
    // Update events on mount and every minute
    const updateEvents = () => {
      setActiveEvents(getActiveEvents());
      setUpcomingEvents(getUpcomingEvents());
    };

    updateEvents();
    const interval = setInterval(updateEvents, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const hasEvents = activeEvents.length > 0 || upcomingEvents.length > 0;

  if (!hasEvents) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-bold mb-2">No Active Events</h3>
        <p className="text-muted max-w-md mx-auto">
          Check back later for special events, bonuses, and limited-time rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Active Events */}
      {activeEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">🎉</span>
            Active Events
          </h3>
          <div className="space-y-3">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} status="active" />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Coming Soon
          </h3>
          <div className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} status="upcoming" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

interface EventCardProps {
  event: LiveOpsEvent;
  status: EventStatus;
}

const EventCard = memo(function EventCard({ event, status }: EventCardProps) {
  const isActive = status === "active";
  const targetDate = isActive ? new Date(event.endDate) : new Date(event.startDate);
  const timeLabel = isActive ? "Ends in" : "Starts in";
  const timeRemaining = formatTimeRemaining(targetDate);

  return (
    <div
      className="card-premium p-4 transition-smooth hover:shadow-premium-lg"
      style={{
        borderLeft: `4px solid ${event.banner?.color || "var(--accent)"}`,
      }}
    >
      <div className="flex items-start gap-3">
        {event.banner?.icon && (
          <div className="text-3xl flex-shrink-0">
            {event.banner.icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold">{event.name}</h4>
            {isActive && (
              <span
                className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                style={{
                  backgroundColor: `rgb(from ${event.banner?.color || "var(--accent)"} r g b / 0.2)`,
                  color: event.banner?.color || "var(--accent)",
                }}
              >
                Live
              </span>
            )}
          </div>

          <p className="text-sm text-muted mb-2">
            {event.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="font-mono">
              {timeLabel}: {timeRemaining}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
