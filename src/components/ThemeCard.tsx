'use client';

import { memo } from 'react';
import type { Theme } from '@/types/theme';

interface ThemeCardProps {
  theme: Theme;
  canAfford: boolean;
  isActive: boolean;
  onPurchase: () => void;
  onActivate: () => void;
  currentShards: number;
}

export const ThemeCard = memo(function ThemeCard({
  theme,
  canAfford,
  isActive,
  onPurchase,
  onActivate,
  currentShards: _currentShards,
}: ThemeCardProps) {
  // No need for useThemeManager - useGame handles both game state and visual theme
  const handleActivate = () => {
    onActivate(); // This will update game state AND apply visual theme via useGame
  };

  const handlePurchase = () => onPurchase();

  const owned = theme.unlocked;
  const affordable = canAfford && !owned;

  return (
    <div
      className={`
        relative flex flex-col items-start justify-between
        w-full max-w-[180px] rounded-xl p-4 transition-all duration-200
        overflow-hidden
        ${isActive ? 'card-premium shadow-accent-lg' : 'card-premium'}
      `}
      style={{
        borderWidth: isActive ? '2px' : '1px',
        borderColor: isActive ? 'var(--accent)' : 'var(--border)',
      }}
    >
      {/* --- Status badges --- */}
      {isActive && (
        <span className="badge-accent absolute top-1 right-1 text-xs">Active</span>
      )}
      {!isActive && owned && (
        <span className="badge-muted absolute top-1 right-1 text-xs">Owned</span>
      )}

      {/* --- Theme preview --- */}
      <div
        className="h-16 w-full rounded-md mb-2 border border-border"
        style={{
          background: theme.preview || 'linear-gradient(to bottom right, var(--accent), var(--card))'
        }}
      />

      {/* --- Title + description --- */}
      <h3 className="text-sm font-semibold mb-1">{theme.displayName}</h3>
      {theme.description && (
        <p className="text-xs text-muted leading-snug mb-2">
          {theme.description}
        </p>
      )}

      {/* --- Buttons --- */}
      {owned ? (
        <button
          onClick={handleActivate}
          disabled={isActive}
          className={`w-full text-sm py-2 px-3 rounded-lg font-semibold ${isActive ? 'btn-muted cursor-default' : 'btn-primary'}`}
        >
          {isActive ? '✓ Active' : 'Activate'}
        </button>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={!affordable}
          className={`w-full text-sm py-2 px-3 rounded-lg font-semibold ${affordable ? 'btn-primary' : 'btn-muted cursor-not-allowed'}`}
        >
          {affordable
            ? `💎 ${theme.cost}`
            : `💎 ${theme.cost}`}
        </button>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render if relevant props changed
  return (
    prevProps.theme.unlocked === nextProps.theme.unlocked &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.canAfford === nextProps.canAfford
  );
});
