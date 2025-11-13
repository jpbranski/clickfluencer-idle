"use client";

import { useState, useRef } from "react";
import { useGame } from "@/hooks/useGame";
import { formatNumber } from "@/game/format";

export default function PostButton() {
  const { handleClick, clickPower, isLoading, state } = useGame();

  const [isPressed, setIsPressed] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<
    Array<{ id: number; value: number; x: number; y: number }>
  >([]);

  const lastClickTime = useRef<number>(0);
  const clickIdCounter = useRef<number>(0);

  const THROTTLE_MS = 50;
  const disabled = isLoading || !state;

  const actualYield = Math.floor(clickPower);

  const handleClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const now = Date.now();
    if (now - lastClickTime.current < THROTTLE_MS) return;
    lastClickTime.current = now;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + (Math.random() * 20 - 10);
    const clickY = e.clientY - rect.top + (Math.random() * 20 - 10);

    const newFloating = {
      id: clickIdCounter.current++,
      value: actualYield,
      x: clickX,
      y: clickY,
    };
    setFloatingNumbers((prev) => [...prev, newFloating]);
    setTimeout(
      () =>
        setFloatingNumbers((prev) =>
          prev.filter((f) => f.id !== newFloating.id),
        ),
      1000,
    );

    handleClick();
  };

  // ──────────────────────────────────────────
  // 🔍 BREAKDOWN LOGIC (read-only, UI only)
  // ──────────────────────────────────────────
  function getBreakdown() {
    if (!state) return null;

    const breakdown: Array<{ label: string; value: string }> = [];

    // Base click power is always 1
    breakdown.push({
      label: "Base",
      value: "1",
    });

    // Better Camera (tier additive)
    const camera = state.upgrades.find((u) => u.id === "better_camera");
    if (camera && camera.tier) {
      const tierBonuses = [0, 1, 2, 3, 5, 8, 15, 25];
      const add = tierBonuses[camera.tier] ?? 0;
      breakdown.push({
        label: `Better Camera (Tier ${camera.tier})`,
        value: `+${add}`,
      });
    }

    // Additive click upgrades
    state.upgrades
      .filter(
        (u) => u.purchased && u.effect.type === "clickAdditive" && u.id !== "better_camera",
      )
      .forEach((u) => {
        breakdown.push({
          label: `${u.name} (Additive)`,
          value: `+${u.effect.value}`,
        });
      });

    // Theme additive
    const activeTheme = state.themes.find((t) => t.active);
    if (activeTheme?.bonusClickPower) {
      breakdown.push({
        label: `Theme Bonus (${activeTheme.name})`,
        value: `+${activeTheme.bonusClickPower}`,
      });
    }

    // Better Filters (Infinite click multiplier)
    const filters = state.upgrades.find((u) => u.id === "better_filters");
    if (filters?.currentLevel && filters.currentLevel > 0) {
      breakdown.push({
        label: `Better Filters (Lv ${filters.currentLevel})`,
        value: `×${filters.effect.value}^${filters.currentLevel}`,
      });
    }

    // AI Enhancements (Global multiplier)
    const ai = state.upgrades.find((u) => u.id === "ai_enhancements");
    if (ai?.currentLevel && ai.currentLevel > 0) {
      breakdown.push({
        label: `AI Enhancements (Lv ${ai.currentLevel})`,
        value: `×${ai.effect.value}^${ai.currentLevel}`,
      });
    }

    // Prestige
    if (state.prestige > 0) {
      breakdown.push({
        label: `Prestige Bonus`,
        value: `×${1 + state.prestige * 0.1}`,
      });
    }

    // Theme multiplier
    if (activeTheme) {
      breakdown.push({
        label: `Theme Multiplier (${activeTheme.name})`,
        value: `×${activeTheme.bonusMultiplier}`,
      });
    }

    return breakdown;
  }

  const breakdown = getBreakdown();

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* CLICK BUTTON */}
      <button
        onClick={handleClickWrapper}
        disabled={disabled}
        className={`
          relative w-48 h-48 rounded-full
          transition-all duration-150 ease-out
          disabled:cursor-not-allowed
          shadow-2xl hover:shadow-accent
          ${isPressed ? "scale-95" : "scale-100 hover:scale-105"}
          ${disabled ? "opacity-50" : "opacity-100"}
        `}
        style={{
          background: disabled ? "var(--muted)" : "var(--accent)",
          color: "var(--accent-foreground)",
        }}
        aria-label={`Click to gain ${actualYield} followers`}
        aria-disabled={disabled}
      >
        <div className="flex flex-col items-center justify-center text-accent-foreground">
          <span className="text-6xl animate-bounce-slow">👆</span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-wide">
            Post
          </span>
        </div>

        {!disabled && (
          <div
            className={`
              absolute inset-0 rounded-full
              bg-white/20 blur-md
              ${isPressed ? "animate-ping" : "hidden"}
            `}
          />
        )}
      </button>

      {/* FLOATING NUMBERS */}
      <div className="pointer-events-none absolute inset-0">
        {floatingNumbers.map((f) => (
          <div
            key={f.id}
            className="absolute text-2xl font-bold animate-float-up"
            style={{
              color: "var(--success)",
              left: f.x,
              top: f.y,
              textShadow: "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            +{f.value}
          </div>
        ))}
      </div>

      {/* PER CLICK VALUE */}
      <div className="mt-6 text-center">
        <div className="text-sm text-muted uppercase tracking-wide">
          Per Click
        </div>
        <div className="text-3xl font-bold number-display gradient-text">
          {formatNumber(actualYield)}
        </div>
      </div>

      {/* TOGGLE FOR BREAKDOWN */}
      <button
        className="mt-3 text-xs text-accent underline hover:opacity-80"
        onClick={() => setShowBreakdown((prev) => !prev)}
      >
        {showBreakdown ? "Hide Breakdown" : "Show Breakdown"}
      </button>

      {/* BREAKDOWN PANEL */}
      {showBreakdown && breakdown && (
        <div className="mt-4 p-4 bg-surface border border-border rounded-lg text-sm w-64 max-h-64 overflow-y-auto">
          <div className="font-bold mb-2 text-accent">Click Breakdown</div>

          {breakdown.map((row, i) => (
            <div
              key={i}
              className="flex justify-between py-1 border-b border-border/30 last:border-none"
            >
              <span className="text-muted">{row.label}</span>
              <span className="font-mono">{row.value}</span>
            </div>
          ))}

          <div className="mt-3 pt-2 border-t border-border text-center text-muted text-xs">
            Final: {formatNumber(actualYield)}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-2 text-xs text-muted text-center max-w-xs">
        Click to gain followers and grow your influence!
      </div>
    </div>
  );
}
