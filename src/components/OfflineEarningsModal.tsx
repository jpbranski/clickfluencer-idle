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
  credsGained: number;
  wasCapped: boolean;
}

export function OfflineEarningsModal({
  isOpen,
  onClose,
  timeAway,
  timeProcessed,
  credsGained,
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
          border-2 border-accent
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
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              Time Away
            </div>
            <div className="text-lg font-bold text-accent">
              {formatTimeDetailed(timeAway)}
            </div>
          </div>

          {/* Creds Gained */}
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              Creds Gained
            </div>
            <div className="text-2xl font-bold text-success number-display">
              +{formatNumber(credsGained)}
            </div>
          </div>

          {/* Time Processed (if capped) */}
          {wasCapped && (
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start gap-2">
                <span
                  className="text-warning text-xl"
                  role="img"
                  aria-label="warning"
                >
                  ⚠️
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-warning mb-1">
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
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-2 text-xs text-muted">
              <span
                className="text-accent"
                role="img"
                aria-label="info"
              >
                💡
              </span>
              <p>
                Your content generators continued working while you were away,
                earning creds based on your production rate.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="btn-accent w-full"
            aria-label="Close offline earnings dialog"
          >
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
}
