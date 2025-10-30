'use client';

/**
 * PostButton.tsx - Main Clicker Component
 * 
 * Features:
 * - Throttles clicks to ≤20 clicks/second (50ms minimum between clicks)
 * - Randomizes yield by ±5% per click
 * - Respects prefers-reduced-motion
 * - Visual feedback with animations
 * - ARIA accessible
 */

import { useState, useRef } from 'react';

interface PostButtonProps {
  onClick: () => void;
  clickPower: number;
  disabled?: boolean;
}

export function PostButton({ onClick, clickPower, disabled = false }: PostButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{ id: number; value: number; x: number; y: number }>>([]);
  const lastClickTime = useRef<number>(0);
  const clickIdCounter = useRef<number>(0);
  
  // Throttle: Maximum 20 clicks per second = 50ms between clicks
  const THROTTLE_MS = 50;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const now = Date.now();
    if (now - lastClickTime.current < THROTTLE_MS) {
      // Throttle exceeded, ignore click
      return;
    }

    lastClickTime.current = now;

    // Randomize yield by ±5%
    const randomFactor = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
    const actualYield = Math.floor(clickPower * randomFactor);

    // Visual feedback
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    // Create floating number effect
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const newFloating = {
      id: clickIdCounter.current++,
      value: actualYield,
      x: clickX,
      y: clickY,
    };

    setFloatingNumbers(prev => [...prev, newFloating]);

    // Remove floating number after animation
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(f => f.id !== newFloating.id));
    }, 1000);

    // Execute click callback
    onClick();
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Main Click Button */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative w-48 h-48 rounded-full
          bg-gradient-to-br from-purple-500 to-pink-500
          hover:from-purple-600 hover:to-pink-600
          active:from-purple-700 active:to-pink-700
          disabled:from-gray-400 disabled:to-gray-500
          disabled:cursor-not-allowed
          shadow-2xl hover:shadow-purple-500/50
          transition-all duration-150 ease-out
          motion-reduce:transition-none
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-400
          ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
          ${disabled ? 'opacity-50' : 'opacity-100'}
        `}
        aria-label={`Click to gain ${clickPower} followers per click`}
        aria-disabled={disabled}
      >
        {/* Button Icon/Emoji */}
        <div className="flex flex-col items-center justify-center text-white">
          <span className="text-6xl motion-reduce:animate-none animate-bounce-slow" role="img" aria-label="hand pointing up">
            👆
          </span>
          <span className="mt-2 text-sm font-semibold uppercase tracking-wide">
            Post
          </span>
        </div>

        {/* Ripple Effect */}
        {!disabled && (
          <div 
            className={`
              absolute inset-0 rounded-full
              bg-white/20 blur-md
              motion-reduce:hidden
              ${isPressed ? 'animate-ping' : 'hidden'}
            `}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Floating Numbers */}
      <div className="pointer-events-none absolute inset-0" aria-live="polite" aria-atomic="true">
        {floatingNumbers.map(floating => (
          <div
            key={floating.id}
            className="absolute text-2xl font-bold text-green-500 motion-reduce:hidden animate-float-up"
            style={{
              left: floating.x,
              top: floating.y,
            }}
          >
            +{floating.value}
          </div>
        ))}
      </div>

      {/* Click Power Display */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Per Click
        </div>
        <div className="text-3xl font-bold number-display gradient-text">
          {clickPower.toFixed(0)}
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-center max-w-xs">
        Click to gain followers and grow your influence!
      </div>
    </div>
  );
}

// Add floating animation to globals.css if not already present
// @keyframes float-up {
//   0% {
//     opacity: 1;
//     transform: translateY(0);
//   }
//   100% {
//     opacity: 0;
//     transform: translateY(-50px);
//   }
// }
// .animate-float-up {
//   animation: float-up 1s ease-out forwards;
// }