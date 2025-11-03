"use client";

/**
 * SlideUpSheet - Mobile Slide-Up Sheet
 *
 * Bottom sheet that slides up to show tab content on mobile.
 * Includes tab navigation and content area.
 */

import { ReactNode, useEffect } from "react";

interface SlideUpSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "generators" | "upgrades" | "themes" | "achievements" | "settings";
  onTabChange: (tab: "generators" | "upgrades" | "themes" | "achievements" | "settings") => void;
  children: ReactNode;
}

export function SlideUpSheet({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  children,
}: SlideUpSheetProps) {
  // Prevent scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col lg:hidden">
        {/* Handle */}
        <div className="flex justify-center py-3 border-b border-border">
          <button
            onClick={onClose}
            className="w-12 h-1.5 bg-muted rounded-full"
            aria-label="Close sheet"
          />
        </div>

        {/* Tab Navigation */}
        <div className="p-2 border-b border-border flex gap-1 overflow-x-auto">
          <button
            onClick={() => onTabChange("generators")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === "generators"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-surface text-foreground"
            }`}
          >
            📈 Generators
          </button>
          <button
            onClick={() => onTabChange("upgrades")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === "upgrades"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-surface text-foreground"
            }`}
          >
            ⚡ Upgrades
          </button>
          <button
            onClick={() => onTabChange("themes")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === "themes"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-surface text-foreground"
            }`}
          >
            🎨 Themes
          </button>
          <button
            onClick={() => onTabChange("achievements")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === "achievements"
                ? "bg-accent text-accent-foreground"
                : "hover:bg-surface text-foreground"
            }`}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
