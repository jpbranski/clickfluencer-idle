"use client";

/**
 * CommandPanel - Dev console commands
 */

import { memo, useState } from "react";
import { GameState } from "@/game/state";
import { DevCommand } from "./DevConsole";
import { ALL_ACHIEVEMENTS as achievements } from "@/data/achievements";

interface CommandPanelProps {
  gameState: GameState;
  onExecuteCommand: (command: DevCommand) => void;
}

export const CommandPanel = memo(function CommandPanel({
  gameState,
  onExecuteCommand,
}: CommandPanelProps) {
  const [credAmount, setCredAmount] = useState("1000000");
  const [awardAmount, setAwardAmount] = useState("1000");
  const [prestigeAmount, setPrestigeAmount] = useState("1");
  const [tickCount, setTickCount] = useState("100");
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [commandLog, setCommandLog] = useState<string[]>([]);

  const executeCommand = (command: DevCommand, logMessage: string) => {
    onExecuteCommand(command);
    setCommandLog((prev) => [...prev.slice(-9), `✓ ${logMessage}`]);
  };

  const unlockedAchievements = new Set(
    Object.entries(gameState.achievements || {})
      .filter(([, data]) => data.unlocked)
      .map(([id]) => id)
  );

  const availableAchievements = achievements.filter(
    (ach) => !unlockedAchievements.has(ach.id)
  );

  return (
    <div className="p-4 space-y-6">
      {/* Resources */}
      <CommandSection title="💰 Resources">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">Add Creds</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={credAmount}
                onChange={(e) => setCredAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-surface border border-border text-sm font-mono"
                placeholder="Amount"
              />
              <button
                onClick={() =>
                  executeCommand(
                    { type: "add_creds", amount: parseInt(credAmount) || 0 },
                    `Added ${credAmount} creds`
                  )
                }
                className="btn-primary px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Add Awards</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={awardAmount}
                onChange={(e) => setAwardAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-surface border border-border text-sm font-mono"
                placeholder="Amount"
              />
              <button
                onClick={() =>
                  executeCommand(
                    { type: "add_awards", amount: parseInt(awardAmount) || 0 },
                    `Added ${awardAmount} awards`
                  )
                }
                className="btn-primary px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Add Prestige Levels</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={prestigeAmount}
                onChange={(e) => setPrestigeAmount(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-surface border border-border text-sm font-mono"
                placeholder="Amount"
              />
              <button
                onClick={() =>
                  executeCommand(
                    {
                      type: "add_prestige",
                      amount: parseInt(prestigeAmount) || 0,
                    },
                    `Added ${prestigeAmount} prestige level(s)`
                  )
                }
                className="btn-primary px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </CommandSection>

      {/* Achievements */}
      <CommandSection title="🏆 Achievements">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">
              Unlock Achievement
            </label>
            <select
              value={selectedAchievement}
              onChange={(e) => setSelectedAchievement(e.target.value)}
              className="w-full px-3 py-2 rounded bg-surface border border-border text-sm mb-2"
            >
              <option value="">Select achievement...</option>
              {availableAchievements.map((ach) => (
                <option key={ach.id} value={ach.id}>
                  {ach.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (selectedAchievement) {
                  const ach = achievements.find((a) => a.id === selectedAchievement);
                  executeCommand(
                    { type: "unlock_achievement", id: selectedAchievement },
                    `Unlocked: ${ach?.name || selectedAchievement}`
                  );
                  setSelectedAchievement("");
                }
              }}
              disabled={!selectedAchievement}
              className="btn-primary px-4 py-2 text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>
          </div>
        </div>
      </CommandSection>

      {/* Game Simulation */}
      <CommandSection title="⏱ Simulation">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">
              Simulate Game Ticks
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tickCount}
                onChange={(e) => setTickCount(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-surface border border-border text-sm font-mono"
                placeholder="Tick count"
              />
              <button
                onClick={() =>
                  executeCommand(
                    { type: "simulate_ticks", count: parseInt(tickCount) || 0 },
                    `Simulated ${tickCount} ticks`
                  )
                }
                className="btn-primary px-4 py-2 text-sm"
              >
                Run
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              Game runs at 4 ticks/second. 100 ticks ≈ 25 seconds.
            </p>
          </div>

          <button
            onClick={() =>
              executeCommand(
                { type: "reset_offline_timer" },
                "Reset offline timer to now"
              )
            }
            className="btn-secondary px-4 py-2 text-sm w-full"
          >
            Reset Offline Timer
          </button>
        </div>
      </CommandSection>

      {/* Game State */}
      <CommandSection title="🎮 Game State">
        <div className="space-y-3">
          <button
            onClick={() =>
              executeCommand({ type: "reset_ftue" }, "Reset FTUE tutorial")
            }
            className="btn-secondary px-4 py-2 text-sm w-full"
          >
            Reset Tutorial (FTUE)
          </button>

          <button
            onClick={() =>
              executeCommand(
                { type: "force_announcements" },
                "Forced announcements modal"
              )
            }
            className="btn-secondary px-4 py-2 text-sm w-full"
          >
            Force Announcements Modal
          </button>
        </div>
      </CommandSection>

      {/* Command Log */}
      {commandLog.length > 0 && (
        <CommandSection title="📝 Command Log">
          <div className="bg-surface/50 rounded p-3 max-h-48 overflow-y-auto">
            <div className="space-y-1 text-xs font-mono">
              {commandLog.map((log, i) => (
                <div key={i} className="text-muted">
                  {log}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCommandLog([])}
            className="mt-2 text-xs text-muted hover:text-foreground"
          >
            Clear Log
          </button>
        </CommandSection>
      )}

      {/* Warning */}
      <div
        className="rounded p-3 text-xs"
        style={{
          backgroundColor: "rgb(from var(--warning) r g b / 0.1)",
          border: "1px solid var(--warning)",
          color: "var(--warning)",
        }}
      >
        <strong>⚠️ Development Only</strong>
        <br />
        These commands modify game state directly. Use with caution. Changes are
        saved to localStorage.
      </div>
    </div>
  );
});

function CommandSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border p-3 bg-surface/30">
      <h3 className="font-bold text-sm mb-3 text-accent">{title}</h3>
      {children}
    </div>
  );
}
