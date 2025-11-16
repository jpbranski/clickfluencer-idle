"use client";

/**
 * OfflineEarningsModal.tsx - Offline Earnings Display
 * Phase 3: Enhanced with detailed breakdown and achievements
 *
 * Shows a modal with earnings accumulated while away
 * Displays time away, resources gained, top contributors, and achievements
 */

import { formatNumber, formatTimeDetailed } from "@/game/format";
import { motion } from "framer-motion";

interface OfflineEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeAway: number;
  timeProcessed: number;
  credsGained: number;
  awardsGained?: number;
  wasCapped: boolean;
  topGenerators?: Array<{ name: string; contribution: number }>;
  achievementsUnlocked?: Array<{ name: string; icon: string }>;
}

export function OfflineEarningsModal({
  isOpen,
  onClose,
  timeAway,
  timeProcessed,
  credsGained,
  awardsGained = 0,
  wasCapped,
  topGenerators = [],
  achievementsUnlocked = [],
}: OfflineEarningsModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hasSignificantGains = credsGained > 0 || awardsGained > 0;
  const isLongAbsence = timeAway > 24 * 60 * 60 * 1000; // 24+ hours

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
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Time Away */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-accent/10 border border-accent/20"
          >
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              ⏱ Time Away
            </div>
            <div className="text-lg font-bold text-accent">
              {formatTimeDetailed(timeAway)}
              {isLongAbsence && <span className="ml-2 text-sm">🌙</span>}
            </div>
          </motion.div>

          {/* Resources Gained */}
          {hasSignificantGains && (
            <div className="grid grid-cols-2 gap-3">
              {/* Creds */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-lg bg-success/10 border border-success/20"
              >
                <div className="text-xs text-muted uppercase tracking-wide mb-1">
                  💰 Creds
                </div>
                <div className="text-xl font-bold text-success number-display">
                  +{formatNumber(credsGained)}
                </div>
              </motion.div>

              {/* Awards */}
              {awardsGained > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                >
                  <div className="text-xs text-muted uppercase tracking-wide mb-1">
                    💎 Awards
                  </div>
                  <div className="text-xl font-bold text-purple-400 number-display">
                    +{formatNumber(awardsGained)}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Top Contributors */}
          {topGenerators.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-lg bg-surface/50 border border-border"
            >
              <div className="text-xs text-muted uppercase tracking-wide mb-2">
                🏭 Top Contributors
              </div>
              <div className="space-y-2">
                {topGenerators.slice(0, 3).map((gen, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-foreground">{gen.name}</span>
                    <span className="font-mono text-accent font-semibold">
                      {formatNumber(gen.contribution)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements Unlocked */}
          {achievementsUnlocked.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
            >
              <div className="text-xs text-muted uppercase tracking-wide mb-2">
                🏆 Achievements Unlocked!
              </div>
              <div className="space-y-2">
                {achievementsUnlocked.map((ach, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm bg-background/50 rounded p-2"
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className="font-semibold text-yellow-400">{ach.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

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
