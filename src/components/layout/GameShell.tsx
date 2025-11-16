"use client";

/**
 * GameShell - Option C: Game Dashboard Layout
 *
 * Desktop: Two-column layout (Sidebar 42-48% | Primary Action Zone 52-58%)
 * Mobile: POST button first, then scrollable tabs, then stacked content
 */

import { ReactNode, useState } from "react";
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

  return (
    <div className="min-h-screen">
      {/* Currency HUD - Sticky Top Bar */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-lg">
        {/* Desktop HUD */}
        <div className="hidden lg:flex max-w-[1600px] mx-auto px-6 py-3 items-center justify-between">
          <div className="flex-1">
            {currencyBar}
          </div>
          <div className="ml-4">
            {settingsButton}
          </div>
        </div>

        {/* Mobile HUD */}
        <div className="lg:hidden">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-bold text-accent">Clickfluencer</h1>
            {settingsButton}
          </div>
          <div className="px-4 pb-3">
            {currencyBar}
          </div>
        </div>
      </div>

      {/* Main Game Area - Responsive Grid Layout */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Desktop: Two-Column Grid | Mobile: Single Column Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN - Sidebar Panel (Desktop: 42% | Mobile: 100% below POST) */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            {/* Desktop: Sticky Sidebar Card */}
            <div className="hidden lg:block lg:sticky lg:top-24">
              <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
                {/* Tab Navigation */}
                <div className="p-3 border-b border-border bg-surface/50">
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setActiveTab("generators")}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "generators"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface text-foreground"
                      }`}
                    >
                      📈 Generators
                    </button>
                    <button
                      onClick={() => setActiveTab("upgrades")}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "upgrades"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface text-foreground"
                      }`}
                    >
                      ⚡ Upgrades
                    </button>
                    <button
                      onClick={() => setActiveTab("themes")}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "themes"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface text-foreground"
                      }`}
                    >
                      🎨 Themes
                    </button>
                    <button
                      onClick={() => setActiveTab("achievements")}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "achievements"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface text-foreground"
                      }`}
                    >
                      🏆 Achieve
                    </button>
                  </div>
                </div>

                {/* Tab Content - Scrollable */}
                <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
                  {activeTab === "generators" && generatorsTab}
                  {activeTab === "upgrades" && upgradesTab}
                  {activeTab === "themes" && themesTab}
                  {activeTab === "achievements" && achievementsTab}
                  {activeTab === "settings" && (
                    <div className="text-center p-8">
                      <button
                        onClick={onShowSettings}
                        className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                      >
                        Open Settings
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: Horizontal Scrolling Tabs */}
            <div className="lg:hidden sticky top-[120px] z-30 -mx-4 bg-card/80 backdrop-blur-sm border-b border-border px-2 py-2 overflow-x-auto mobile-tabs-scroll">
              <div className="flex gap-2 min-w-max px-2">
                <button
                  onClick={() => setActiveTab("generators")}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === "generators"
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface text-foreground"
                  }`}
                >
                  📈 Generators
                </button>
                <button
                  onClick={() => setActiveTab("upgrades")}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === "upgrades"
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface text-foreground"
                  }`}
                >
                  ⚡ Upgrades
                </button>
                <button
                  onClick={() => setActiveTab("themes")}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === "themes"
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface text-foreground"
                  }`}
                >
                  🎨 Themes
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === "achievements"
                      ? "bg-accent text-accent-foreground shadow-md"
                      : "bg-surface text-foreground"
                  }`}
                >
                  🏆 Achievements
                </button>
              </div>
            </div>

            {/* Mobile: Tab Content */}
            <div className="lg:hidden mt-4">
              {activeTab === "generators" && generatorsTab}
              {activeTab === "upgrades" && upgradesTab}
              {activeTab === "themes" && themesTab}
              {activeTab === "achievements" && achievementsTab}
            </div>
          </div>

          {/* RIGHT COLUMN - Primary Action Zone (Desktop: 58% | Mobile: 100% at top) */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="space-y-6">
              {/* POST Button - Top Priority */}
              <div className="flex justify-center">
                <div className="w-full lg:w-auto">
                  {children}
                </div>
              </div>

              {/* Quick Stats - Below POST Button */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {quickStats}
                </div>
              </div>

              {/* Share Panel */}
              <div className="flex justify-center">
                <div className="w-full max-w-md p-4 lg:p-6 bg-card rounded-xl border border-border shadow-lg">
                  {shareButtons}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
    </div>
  );
}
