"use client";

/**
 * GameShell - Main Layout Container for v1.0.0
 *
 * Desktop: Left sidebar + main panel
 * Mobile: Top nav + main panel + bottom navigation sheet
 */

import { ReactNode, useState } from "react";
import { SidebarColumn } from "./SidebarColumn";
import { BottomNav } from "./BottomNav";

interface GameShellProps {
  children: ReactNode;
  currencyBar: ReactNode;
  quickStats: ReactNode;
  shareButtons: ReactNode;
  generatorsTab: ReactNode;
  upgradesTab: ReactNode;
  themesTab: ReactNode;
  achievementsTab: ReactNode;
  settingsButton: ReactNode;
  onShowSettings: () => void;
}

export function GameShell({
  children,
  currencyBar,
  quickStats,
  shareButtons,
  generatorsTab,
  upgradesTab,
  themesTab,
  achievementsTab,
  settingsButton,
  onShowSettings,
}: GameShellProps) {
  const [activeTab, setActiveTab] = useState<"generators" | "upgrades" | "themes" | "achievements" | "settings">("generators");
  const [_sheetOpen, _setSheetOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen justify-center">
        <div className="flex w-full max-w-[1280px] px-4">
          {/* Left Sidebar */}
          <SidebarColumn
            currencyBar={currencyBar}
            shareButtons={shareButtons}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            settingsButton={settingsButton}
          >
            {activeTab === "generators" && generatorsTab}
            {activeTab === "upgrades" && upgradesTab}
            {activeTab === "themes" && themesTab}
            {activeTab === "achievements" && achievementsTab}
            {activeTab === "settings" && (
              <div className="p-6 text-center">
                <button
                  onClick={onShowSettings}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Open Settings
                </button>
              </div>
            )}
          </SidebarColumn>

          {/* Main Panel - Click Button + Quick Stats */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
            {children}
            <div className="w-full max-w-md">
              {quickStats}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col pb-20">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-lg">
          <h1 className="text-xl font-bold text-accent">Clickfluencer</h1>
          {settingsButton}
        </header>

        {/* Main Content Area - Shows active tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "generators" && generatorsTab}
          {activeTab === "upgrades" && upgradesTab}
          {activeTab === "themes" && themesTab}
          {activeTab === "achievements" && achievementsTab}
        </div>

        {/* Bottom Navigation - Always Visible */}
        <BottomNav
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
    </div>
  );
}
