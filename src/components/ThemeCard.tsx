'use client';

import { useThemeManager } from '@/hooks/useThemeManager';
import type { Theme } from '@/types/theme';

interface ThemeCardProps {
  theme: Theme;
  canAfford: boolean;
  isActive: boolean;
  onPurchase: () => void;
  onActivate: () => void;
  currentShards: number;
}

export function ThemeCard({
  theme,
  canAfford,
  isActive,
  onPurchase,
  onActivate,
  currentShards,
}: ThemeCardProps) {
  const { changeTheme } = useThemeManager();

  const handleActivate = () => {
    onActivate();               // game logic
    changeTheme(theme.id);      // visual theme
  };

  const handlePurchase = () => onPurchase();

  const owned = theme.unlocked;
  const affordable = canAfford && !owned;

  return (
    <div
      className={`
        relative flex flex-col items-start justify-between
        w-full sm:w-60 rounded-xl border-2 p-4 transition-all duration-200
        bg-card text-foreground
        ${isActive ? 'border-[var(--accent)] shadow-accent ring-1 ring-accent' : 'border-border'}
      `}
    >
      {/* --- Status badges --- */}
      {isActive && (
        <span className="badge-accent absolute top-3 right-3">Active</span>
      )}
      {!isActive && owned && (
        <span className="badge-muted absolute top-3 right-3">Owned</span>
      )}

      {/* --- Theme preview --- */}
      <div
        className={`
          h-24 w-full rounded-lg mb-3 border border-border
          ${theme.preview || 'bg-gradient-to-br from-[var(--accent)]/50 to-[var(--card)]'}
        `}
      />

      {/* --- Title + description --- */}
      <h3 className="text-lg font-semibold mb-1">{theme.displayName}</h3>
      {theme.description && (
        <p className="text-sm text-muted leading-snug mb-3">
          {theme.description}
        </p>
      )}

      {/* --- Buttons --- */}
      {owned ? (
        <button
          onClick={handleActivate}
          disabled={isActive}
          className={`w-full ${isActive ? 'btn-muted cursor-default' : 'btn-accent'}`}
        >
          {isActive ? 'Currently Active' : 'Activate'}
        </button>
      ) : (
        <button
          onClick={handlePurchase}
          disabled={!affordable}
          className={`w-full ${affordable ? 'btn-accent' : 'btn-muted cursor-not-allowed'}`}
        >
          {affordable
            ? `Unlock (${theme.cost} 💎)`
            : `Need ${theme.cost - currentShards} more 💎`}
        </button>
      )}
    </div>
  );
}
