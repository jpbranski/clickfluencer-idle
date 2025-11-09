"use client";

/**
 * SidebarColumn - Desktop Left Sidebar
 *
 * Contains:
 * - Currency + Quick Stats (top)
 * - Tab Navigation (middle)
 * - Tab Content (scrollable)
 * - Share Buttons (sticky bottom)
 */

import { ReactNode } from "react";

interface SidebarColumnProps {
  currencyBar: ReactNode;
  shareButtons: ReactNode;
  activeTab: "generators" | "upgrades" | "themes" | "achievements" | "settings";
  onTabChange: (tab: "generators" | "upgrades" | "themes" | "achievements" | "settings") => void;
  settingsButton: ReactNode;
  children: ReactNode;
}

export function SidebarColumn({
  currencyBar,
  shareButtons,
  activeTab,
  onTabChange,
  settingsButton,
  children,
}: SidebarColumnProps) {
  return (
    <div className="w-[400px] xl:w-[480px] flex flex-col bg-card border-r border-border">
      {/* Top Section - Currency */}
      <div className="p-4 space-y-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-accent">Clickfluencer</h1>
          {settingsButton}
        </div>
        {currencyBar}
      </div>

      {/* Tab Navigation */}
      <div className="p-2 border-b border-border grid grid-cols-2 gap-1">
        <button
          onClick={() => onTabChange("generators")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "generators"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-surface text-foreground"
          }`}
        >
          📈 Generators
        </button>
        <button
          onClick={() => onTabChange("upgrades")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "upgrades"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-surface text-foreground"
          }`}
        >
          ⚡ Upgrades
        </button>
        <button
          onClick={() => onTabChange("themes")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "themes"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-surface text-foreground"
          }`}
        >
          🎨 Themes
        </button>
        <button
          onClick={() => onTabChange("achievements")}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "achievements"
              ? "bg-accent text-accent-foreground"
              : "hover:bg-surface text-foreground"
          }`}
        >
          🏆 Achievements
        </button>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Section - Share Buttons (Sticky) */}
      <div className="p-4 border-t border-border bg-card">
        {shareButtons}
      </div>
    </div>
  );
}
