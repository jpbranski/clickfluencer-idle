"use client";

/**
 * DevConsole - In-game Developer Tools
 * Phase 3: Only visible in development mode
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState } from "@/game/state";
import { formatNumber } from "@/game/format";
import { StateInspector } from "./StateInspector";
import { CommandPanel } from "./CommandPanel";

interface DevConsoleProps {
  gameState: GameState;
  onExecuteCommand: (command: DevCommand) => void;
}

export type DevCommand =
  | { type: "add_creds"; amount: number }
  | { type: "add_awards"; amount: number }
  | { type: "add_prestige"; amount: number }
  | { type: "unlock_achievement"; id: string }
  | { type: "reset_ftue" }
  | { type: "simulate_ticks"; count: number }
  | { type: "reset_offline_timer" }
  | { type: "force_announcements" };

export const DevConsole = memo(function DevConsole({
  gameState,
  onExecuteCommand,
}: DevConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"inspector" | "commands">("inspector");

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg font-mono text-sm shadow-premium-lg transition-all hover:scale-105"
        style={{
          backgroundColor: "rgb(from var(--accent) r g b / 0.9)",
          color: "var(--accent-foreground)",
          border: "2px solid var(--accent)",
        }}
        title="Developer Console"
      >
        {isOpen ? "◀ Close" : "🛠 Dev"}
      </button>

      {/* Console Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-40 shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--background)",
              borderLeft: "2px solid var(--border)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b border-border"
              style={{
                backgroundColor: "rgb(from var(--accent) r g b / 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold font-mono">🛠 Dev Console</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("inspector")}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                    activeTab === "inspector"
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  Inspector
                </button>
                <button
                  onClick={() => setActiveTab("commands")}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                    activeTab === "commands"
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  Commands
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-full pb-32">
              {activeTab === "inspector" && (
                <StateInspector gameState={gameState} />
              )}
              {activeTab === "commands" && (
                <CommandPanel
                  gameState={gameState}
                  onExecuteCommand={onExecuteCommand}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
