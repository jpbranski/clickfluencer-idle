"use client";

/**
 * GameShell - Option C Game Dashboard Layout
 *
 * Desktop: Two-column dashboard (Sidebar 42-48% | Action Zone 52-58%)
 * Mobile: Game-first layout (POST button → tabs → content)
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
      {/* ===== DESKTOP LAYOUT - Two-Column Game Dashboard ===== */}
      <div className="hidden lg:block">
        {/* Sticky Currency HUD Header */}
        <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border shadow-lg">
          <div className="max-w-[1400px] mx-auto px-6 py-3">
            {currencyBar}
          </div>
        </div>

        {/* Two-Column Dashboard */}
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Sidebar Panel (42-48%) */}
            <div className="col-span-5">
              <div className="sticky top-[100px]">
                {/* Horizontal Tab Bar */}
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl border border-border shadow-lg p-2 mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab("generators")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "generators"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface/80 text-foreground"
                      }`}
                    >
                      📈 Generators
                    </button>
                    <button
                      onClick={() => setActiveTab("upgrades")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "upgrades"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface/80 text-foreground"
                      }`}
                    >
                      ⚡ Upgrades
                    </button>
                    <button
                      onClick={() => setActiveTab("themes")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "themes"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface/80 text-foreground"
                      }`}
                    >
                      🎨 Themes
                    </button>
                    <button
                      onClick={() => setActiveTab("achievements")}
                      className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === "achievements"
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "hover:bg-surface/80 text-foreground"
                      }`}
                    >
                      🏆 Achievements
                    </button>
                  </div>
                </div>

                {/* Sidebar Content - Scrollable */}
                <div className="max-h-[calc(100vh-240px)] overflow-y-auto pr-2 sidebar-scroll">
                  {activeTab === "generators" && generatorsTab}
                  {activeTab === "upgrades" && upgradesTab}
                  {activeTab === "themes" && themesTab}
                  {activeTab === "achievements" && achievementsTab}
                  {activeTab === "settings" && (
                    <div className="text-center p-8 bg-card rounded-lg border border-border">
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

            {/* Right Column - Primary Action Zone (52-58%) */}
            <div className="col-span-7">
              {/* Settings Button */}
              <div className="flex justify-end mb-4">
                {settingsButton}
              </div>

              {/* POST Button - Top-right prominence */}
              <div className="flex justify-center mb-8">
                {children}
              </div>

              {/* Quick Stats - Below POST button */}
              <div className="mb-8">
                {quickStats}
              </div>

              {/* Share Card */}
              <div className="mb-8">
                <div className="p-6 bg-card rounded-xl border border-border shadow-lg">
                  {shareButtons}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE LAYOUT - Game-First Approach ===== */}
      <div className="lg:hidden min-h-screen flex flex-col pb-20">
        {/* Sticky Mobile HUD */}
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border shadow-lg">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-accent">Clickfluencer</h1>
            {settingsButton}
          </div>
          <div className="px-4 pb-3">
            {currencyBar}
          </div>
        </header>

        {/* POST Button FIRST - Mobile Game Priority */}
        <div className="flex justify-center px-4 py-6 bg-gradient-to-b from-card/50 to-transparent">
          <div className="w-4/5 max-w-xs">
            {children}
          </div>
        </div>

        {/* Horizontal Scrolling Pill Tabs */}
        <div className="sticky top-[120px] z-30 bg-card/80 backdrop-blur-sm border-y border-border px-3 py-3 overflow-x-auto mobile-tabs-scroll">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab("generators")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "generators"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground border border-border"
              }`}
            >
              📈 Generators
            </button>
            <button
              onClick={() => setActiveTab("upgrades")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "upgrades"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground border border-border"
              }`}
            >
              ⚡ Upgrades
            </button>
            <button
              onClick={() => setActiveTab("themes")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "themes"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground border border-border"
              }`}
            >
              🎨 Themes
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === "achievements"
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-surface text-foreground border border-border"
              }`}
            >
              🏆 Achievements
            </button>
          </div>
        </div>

        {/* Tab Content - Stacked Vertical Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {activeTab === "generators" && generatorsTab}
          {activeTab === "upgrades" && upgradesTab}
          {activeTab === "themes" && themesTab}
          {activeTab === "achievements" && achievementsTab}
        </div>

        {/* Quick Stats - Mobile */}
        <div className="px-4 mb-6">
          {quickStats}
        </div>

        {/* Share Card - Mobile (Vertical Gradient) */}
        <div className="px-4 mb-6">
          <div className="p-5 bg-card rounded-xl border border-border shadow-lg">
            {shareButtons}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
      </div>
    </div>
  );
}
