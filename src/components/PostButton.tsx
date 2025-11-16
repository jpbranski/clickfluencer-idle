"use client";

import { useState, useRef, useMemo } from "react";
import { useGame } from "@/hooks/useGame";
import { formatNumber } from "@/game/format";

const MAX_FLOATING_NUMBERS = 20; // Limit floating numbers to prevent memory issues
const THROTTLE_MS = 50;

export default function PostButton() {
  const { handleClick, clickPower, isLoading, state } = useGame();

  const [isPressed, setIsPressed] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<
    Array<{ id: number; value: number; x: number; y: number }>
  >([]);

  const lastClickTime = useRef<number>(0);
  const clickIdCounter = useRef<number>(0);

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

    // Limit floating numbers to prevent memory issues during rapid clicking
    setFloatingNumbers((prev) => {
      const updated = [...prev, newFloating];
      // Keep only the most recent MAX_FLOATING_NUMBERS
      return updated.slice(-MAX_FLOATING_NUMBERS);
    });

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
  // Memoized to prevent recalculation on every render
  // ──────────────────────────────────────────
  const breakdown = useMemo(() => {
    if (!state) return null;

    const breakdownItems: Array<{ label: string; value: string }> = [];

    // Base click power is always 1
    breakdownItems.push({
      label: "Base",
      value: "1",
    });

    // Better Camera (tier additive)
    const camera = state.upgrades.find((u) => u.id === "better_camera");
    if (camera && camera.tier) {
      const tierBonuses = [0, 1, 2, 3, 5, 8, 15, 25];
      const add = tierBonuses[camera.tier] ?? 0;
      breakdownItems.push({
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
        breakdownItems.push({
          label: `${u.name} (Additive)`,
          value: `+${u.effect.value}`,
        });
      });

    // Theme additive
    const activeTheme = state.themes.find((t) => t.active);
    if (activeTheme?.bonusClickPower) {
      breakdownItems.push({
        label: `Theme Bonus (${activeTheme.name})`,
        value: `+${activeTheme.bonusClickPower}`,
      });
    }

    // Better Filters (Infinite click multiplier)
    const filters = state.upgrades.find((u) => u.id === "better_filters");
    if (filters?.currentLevel && filters.currentLevel > 0) {
      breakdownItems.push({
        label: `Better Filters (Lv ${filters.currentLevel})`,
        value: `×${filters.effect.value}^${filters.currentLevel}`,
      });
    }

    // AI Enhancements (Global multiplier)
    const ai = state.upgrades.find((u) => u.id === "ai_enhancements");
    if (ai?.currentLevel && ai.currentLevel > 0) {
      breakdownItems.push({
        label: `AI Enhancements (Lv ${ai.currentLevel})`,
        value: `×${ai.effect.value}^${ai.currentLevel}`,
      });
    }

    // Prestige
    if (state.prestige > 0) {
      breakdownItems.push({
        label: `Prestige Bonus`,
        value: `×${1 + state.prestige * 0.1}`,
      });
    }

    // Theme multiplier
    if (activeTheme) {
      breakdownItems.push({
        label: `Theme Multiplier (${activeTheme.name})`,
        value: `×${activeTheme.bonusMultiplier}`,
      });
    }

    return breakdownItems;
  }, [state?.upgrades, state?.prestige, state?.themes]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* PREMIUM CLICK BUTTON */}
      <div className="relative">
        {/* Glow Effect - Soft Ambient Halo */}
        {!disabled && (
          <div
            className="absolute inset-0 rounded-full opacity-35 blur-xl"
            style={{
              background: "var(--accent)",
            }}
          />
        )}

        <button
          onClick={handleClickWrapper}
          disabled={disabled}
          className={`
            relative w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full
            transition-all duration-200 ease-out
            disabled:cursor-not-allowed
            overflow-hidden group
            ${isPressed ? "scale-95" : "scale-100 hover:scale-105"}
            ${disabled ? "opacity-50" : "opacity-100"}
          `}
          style={{
            background: disabled
              ? "var(--muted)"
              : "linear-gradient(135deg, var(--accent) 0%, rgb(from var(--accent) r g b) 100%)",
            color: "var(--accent-foreground)",
            boxShadow: disabled
              ? "none"
              : "0 0 40px rgb(from var(--accent) r g b / 0.35)",
          }}
          aria-label={`Click to gain ${actualYield} followers`}
          aria-disabled={disabled}
        >
          {/* Shine Effect on Hover */}
          {!disabled && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              }}
            />
          )}

          <div className="flex flex-col items-center justify-center text-accent-foreground relative z-10">
            <span className="text-7xl mb-2 group-hover:scale-110 transition-transform duration-200">
              👆
            </span>
            <span className="text-base font-bold uppercase tracking-wider">
              Post
            </span>
          </div>

          {/* Click Ripple Effect */}
          {!disabled && (
            <div
              className={`
                absolute inset-0 rounded-full
                bg-white/30 blur-md
                ${isPressed ? "animate-ping" : "hidden"}
              `}
            />
          )}
        </button>
      </div>

      {/* FLOATING NUMBERS */}
      <div className="pointer-events-none absolute inset-0">
        {floatingNumbers.map((f) => (
          <div
            key={f.id}
            className="absolute text-2xl font-bold animate-float-up drop-shadow-lg"
            style={{
              color: "var(--success)",
              left: f.x,
              top: f.y,
              textShadow: "0 0 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            +{f.value}
          </div>
        ))}
      </div>

      {/* PER CLICK VALUE */}
      <div className="mt-8 text-center">
        <div className="stat-label mb-1">
          Per Click
        </div>
        <div className="stat-value text-4xl">
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
