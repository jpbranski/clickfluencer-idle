"use client";

/**
 * PostButton.tsx - Main Clicker Component (Context Integrated)
 *
 * Features:
 * - Integrated with useGame() hook (no props needed)
 * - Throttles clicks to ≤20 clicks/second (50ms min)
 * - Shows exact click power value
 * - Floating number visual feedback
 * - Respects prefers-reduced-motion
 */

import { useState, useRef } from "react";
import { useGame } from "@/hooks/useGame";

export default function PostButton() {
  const { handleClick, clickPower, isLoading, state } = useGame();

  const [isPressed, setIsPressed] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<
    Array<{ id: number; value: number; x: number; y: number }>
  >([]);
  const lastClickTime = useRef<number>(0);
  const clickIdCounter = useRef<number>(0);

  const THROTTLE_MS = 50;

  const handleClickWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || !state) return;

    const now = Date.now();
    if (now - lastClickTime.current < THROTTLE_MS) return;
    lastClickTime.current = now;

    // Show exact click power (no randomization to prevent +0 display)
    const actualYield = Math.floor(clickPower);

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + (Math.random() * 20 - 10); // Random offset ±10px
    const clickY = e.clientY - rect.top + (Math.random() * 20 - 10); // Random offset ±10px
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

    handleClick(); // triggers the actual game logic
  };

  const disabled = isLoading || !state;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Main Click Button */}
      <button
        onClick={handleClickWrapper}
        disabled={disabled}
        className={`
          relative w-48 h-48 rounded-full
          transition-all duration-150 ease-out
          motion-reduce:transition-none
          focus-visible:outline-none focus-visible:ring-4 ring-accent
          disabled:cursor-not-allowed
          shadow-2xl hover:shadow-accent
          ${isPressed ? "scale-95" : "scale-100 hover:scale-105"}
          ${disabled ? "opacity-50" : "opacity-100"}
        `}
        style={{
          background: disabled ? 'var(--muted)' : 'var(--accent)',
          color: 'var(--accent-foreground)'
        }}
        aria-label={`Click to gain ${clickPower.toFixed(0)} followers`}
        aria-disabled={disabled}
      >
        <div className="flex flex-col items-center justify-center text-accent-foreground">
          <span
            className="text-6xl motion-reduce:animate-none animate-bounce-slow"
            role="img"
            aria-label="hand pointing up"
          >
            👆
          </span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-wide">
            Post
          </span>
        </div>

        {!disabled && (
          <div
            className={`
              absolute inset-0 rounded-full
              bg-white/20 blur-md
              motion-reduce:hidden
              ${isPressed ? "animate-ping" : "hidden"}
            `}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Floating Numbers */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {floatingNumbers.map((floating) => (
          <div
            key={floating.id}
            className="absolute text-2xl font-bold motion-reduce:hidden animate-float-up"
            style={{
              color: 'var(--success)',
              left: floating.x,
              top: floating.y,
              textShadow: "0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
            }}
          >
            +{floating.value}
          </div>
        ))}
      </div>

      {/* Click Power Display */}
      <div className="mt-6 text-center">
        <div className="text-sm text-muted uppercase tracking-wide">
          Per Click
        </div>
        <div className="text-3xl font-bold number-display gradient-text">
          {clickPower.toFixed(0)}
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-muted text-center max-w-xs">
        Click to gain followers and grow your influence!
      </div>
    </div>
  );
}
