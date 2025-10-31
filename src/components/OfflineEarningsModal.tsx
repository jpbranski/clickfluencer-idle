"use client";

/**
 * OfflineEarningsModal.tsx - Offline Earnings Display
 *
 * Shows a modal with earnings accumulated while away
 * Displays time away, followers gained, and any caps applied
 */

import { formatNumber, formatTimeDetailed } from "@/game/format";

interface OfflineEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeAway: number;
  timeProcessed: number;
  followersGained: number;
  wasCapped: boolean;
}

export function OfflineEarningsModal({
  isOpen,
  onClose,
  timeAway,
  timeProcessed,
  followersGained,
  wasCapped,
}: OfflineEarningsModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-earnings-title"
    >
      <div
        className="
          relative w-full max-w-md
          bg-surface
          rounded-2xl shadow-2xl
          border-2 border-purple-400 dark:border-purple-600
          motion-reduce:transition-none animate-scale-in
        "
      >
        {/* Decorative Elements */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-4xl shadow-lg motion-reduce:animate-none animate-bounce">
            😴
          </div>
        </div>

        {/* Header */}
        <div className="pt-12 pb-4 px-6 text-center border-b border-border">
          <h2
            id="offline-earnings-title"
            className="text-2xl font-bold mb-2 gradient-text"
          >
            Welcome Back!
          </h2>
          <p className="text-sm text-muted">
            Your influence grew while you were away
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Time Away */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              Time Away
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatTimeDetailed(timeAway)}
            </div>
          </div>

          {/* Followers Gained */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              Followers Gained
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 number-display">
              +{formatNumber(followersGained)}
            </div>
          </div>

          {/* Time Processed (if capped) */}
          {wasCapped && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <span
                  className="text-yellow-600 dark:text-yellow-400 text-xl"
                  role="img"
                  aria-label="warning"
                >
                  ⚠️
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                    Progress Capped
                  </div>
                  <div className="text-xs text-muted">
                    Offline progress is limited to{" "}
                    {formatTimeDetailed(timeProcessed)} (
                    {(timeProcessed / (60 * 60 * 1000)).toFixed(0)} hours).
                    Consider checking in more frequently to maximize gains!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2 text-xs text-muted">
              <span
                className="text-purple-600 dark:text-purple-400"
                role="img"
                aria-label="info"
              >
                💡
              </span>
              <p>
                Your content generators continued working while you were away,
                earning followers based on your production rate.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="
              w-full px-6 py-3 rounded-lg
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-purple-600 hover:to-pink-600
              text-white font-semibold
              shadow-lg hover:shadow-xl
              transition-all duration-150 active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2
              motion-reduce:transition-none
            "
            aria-label="Close offline earnings dialog"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
}
