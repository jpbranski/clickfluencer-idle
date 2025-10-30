'use client';

/**
 * EventLog.tsx - Event History Component
 * 
 * Displays a chronological log of recent events
 * Shows past events with timestamps
 */

import { useState } from 'react';

interface EventLogEntry {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  type: 'event' | 'achievement' | 'milestone' | 'prestige';
}

interface EventLogProps {
  entries: EventLogEntry[];
  maxEntries?: number;
}

export function EventLog({ entries, maxEntries = 50 }: EventLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayEntries = entries.slice(0, maxEntries);
  const visibleEntries = isExpanded ? displayEntries : displayEntries.slice(0, 5);

  const getEntryIcon = (type: string): string => {
    switch (type) {
      case 'event':
        return '✨';
      case 'achievement':
        return '🏆';
      case 'milestone':
        return '🎯';
      case 'prestige':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getEntryColor = (type: string): string => {
    switch (type) {
      case 'event':
        return 'text-purple-600 dark:text-purple-400';
      case 'achievement':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'milestone':
        return 'text-blue-600 dark:text-blue-400';
      case 'prestige':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    if (seconds > 0) return `${seconds}s ago`;
    return 'just now';
  };

  if (displayEntries.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
        <h3 className="text-lg font-bold mb-4">Event Log</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm">No events yet. Keep playing to see your history!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Event Log</h3>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {displayEntries.length} {displayEntries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Log Entries */}
      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
        {visibleEntries.map((entry, index) => (
          <div
            key={`${entry.id}-${index}`}
            className="
              flex items-start gap-3 p-3 rounded-lg
              bg-gray-50 dark:bg-gray-900/50
              hover:bg-gray-100 dark:hover:bg-gray-900
              transition-colors duration-150
              motion-reduce:transition-none
            "
          >
            {/* Icon */}
            <div
              className={`flex-shrink-0 text-xl ${getEntryColor(entry.type)}`}
              aria-hidden="true"
            >
              {getEntryIcon(entry.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold line-clamp-1">
                  {entry.name}
                </span>
                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-500">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {displayEntries.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            w-full mt-3 px-3 py-2 rounded-lg
            bg-gray-100 dark:bg-gray-900
            hover:bg-gray-200 dark:hover:bg-gray-800
            text-sm font-semibold
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400
            motion-reduce:transition-none
          "
          aria-expanded={isExpanded}
        >
          {isExpanded ? '↑ Show Less' : `↓ Show More (${displayEntries.length - 5})`}
        </button>
      )}

      {/* Clear Log Button */}
      {displayEntries.length > 0 && (
        <button
          onClick={() => {
            // TODO: Clear log action
          }}
          className="
            w-full mt-2 px-3 py-1 rounded
            text-xs text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
            motion-reduce:transition-none
          "
        >
          Clear Log
        </button>
      )}
    </div>
  );
}