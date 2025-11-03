"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/hooks/useGame";
import PostButton from "@/components/PostButton";
import { CurrencyBar } from "@/components/CurrencyBar";
import { GeneratorCard } from "@/components/GeneratorCard";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EventToasts } from "@/components/EventToasts";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { ShareButtons } from "@/components/ShareButtons";
import { GameShell } from "@/components/layout/GameShell";
import { UpgradesPanel } from "@/components/Upgrades/UpgradesPanel";
import { ThemesPanel } from "@/components/Themes/ThemesPanel";
import { AchievementsPanel } from "@/components/Achievements/AchievementsPanel";
import { formatNumber } from "@/game/format";
import { getGeneratorCost, canAfford } from "@/game/state";
import { getAwardDropRate } from "@/game/actions";
import { loadSaveSystem } from "@/lib/storage/slotStorage";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [checkingSlot, setCheckingSlot] = useState(true);

  const {
    state,
    isLoading,
    clickPower,
    followersPerSecond,
    canPrestige,
    reputationGain,
    prestigeCost,
    handleBuyGenerator,
    handleBuyUpgrade,
    handlePurchaseTheme,
    handleActivateTheme,
    handlePrestige,
    handleUpdateSetting,
    handleExportSave,
    handleImportSave,
    handleResetGame,
    offlineProgress,
    dismissOfflineProgress,
  } = useGame();

  // Check if active slot exists, redirect to /start if not
  useEffect(() => {
    const checkActiveSlot = async () => {
      try {
        const saveSystem = await loadSaveSystem();
        const activeSlot = saveSystem.slots[saveSystem.activeSlotId];

        // If no active slot exists (empty slot), redirect to /start
        if (!activeSlot) {
          router.push("/start");
          return;
        }

        setCheckingSlot(false);
      } catch (error) {
        console.error("Error checking active slot:", error);
        setCheckingSlot(false);
      }
    };

    checkActiveSlot();
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || checkingSlot || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📱</div>
          <div className="text-xl font-semibold">Loading Clickfluencer...</div>
        </div>
      </div>
    );
  }

  // Settings Button Component
  const settingsButton = (
    <button
      onClick={() => setShowSettings(true)}
      className="p-2 rounded-lg hover:bg-surface transition-colors"
      aria-label="Settings"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
  );

  // Currency Bar Component
  const currencyBar = (
    <CurrencyBar
      followers={state.followers}
      shards={state.shards}
      awardDropRate={state ? getAwardDropRate(state) : 0.003}
      followersPerSecond={followersPerSecond}
      reputation={state.reputation}
      notoriety={state.notoriety?.amount || 0}
      notorietyPerSecond={state.notoriety?.unlocked ? (
        state.followers >= (state.notoriety.amount * state.notoriety.upkeepRate)
          ? state.notoriety.basePerSec
          : 0
      ) : 0}
    />
  );

  // Quick Stats Component
  const quickStats = (
    <div className="bg-card rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-3 text-foreground">Quick Stats</h2>
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-surface">
          <div className="text-xs text-muted mb-1">Total Clicks</div>
          <div className="text-base font-bold font-mono number-display text-foreground">
            {state.stats.totalClicks.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-surface">
          <div className="text-xs text-muted mb-1">Score</div>
          <div className="text-base font-bold font-mono number-display text-foreground">
            {formatNumber(state.stats.totalFollowersEarned)}
          </div>
        </div>
      </div>
    </div>
  );

  // Share Buttons Component
  const shareButtons = (
    <ShareButtons
      creds={state.followers}
      score={state.stats.totalFollowersEarned}
    />
  );

  // Upgrades Tab Content
  const upgradesTab = (
    <UpgradesPanel
      upgrades={state.upgrades}
      followers={state.followers}
      canPrestige={canPrestige}
      reputationGain={reputationGain}
      reputation={state.reputation}
      onBuyUpgrade={handleBuyUpgrade}
      onPrestige={handlePrestige}
      notoriety={state.notoriety?.amount || 0}
    />
  );

  // Themes Tab Content
  const themesTab = (
    <ThemesPanel
      themes={state.themes}
      shards={state.shards}
      activeThemeId={state.themes.find((t) => t.active)?.id || "dark"}
      onPurchaseTheme={handlePurchaseTheme}
      onActivateTheme={handleActivateTheme}
    />
  );

  // Achievements Tab Content
  const achievementsTab = (
    <AchievementsPanel achievements={state.achievements || []} />
  );

  return (
    <main className="min-h-screen bg-background mt-12 mb-16 pb-20 sm:pb-0">
      {/* Event Toasts */}
      <EventToasts events={state.activeEvents} />

      {/* Offline Earnings Modal */}
      {offlineProgress && (
        <OfflineEarningsModal
          isOpen={true}
          onClose={dismissOfflineProgress}
          timeAway={offlineProgress.timeAway}
          timeProcessed={offlineProgress.timeProcessed}
          followersGained={offlineProgress.followersGained}
          wasCapped={offlineProgress.wasCapped}
        />
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={state.settings}
        onSettingChange={handleUpdateSetting}
        onExport={handleExportSave}
        onImport={handleImportSave}
        onReset={handleResetGame}
        onMainMenu={() => router.push("/start")}
      />

      {/* New Game Shell Layout */}
      <GameShell
        currencyBar={currencyBar}
        quickStats={quickStats}
        shareButtons={shareButtons}
        upgradesTab={upgradesTab}
        themesTab={themesTab}
        achievementsTab={achievementsTab}
        settingsButton={settingsButton}
        onShowSettings={() => setShowSettings(true)}
      >
        {/* Main Click Button */}
        <div className="w-full max-w-md">
          <PostButton />
        </div>
      </GameShell>
    </main>
  );
}
