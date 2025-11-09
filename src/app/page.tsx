"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import PostButton from "@/components/PostButton";
import { CurrencyBar } from "@/components/CurrencyBar";
import { GeneratorsPanel } from "@/components/panels/GeneratorsPanel";
import { SettingsDialog } from "@/components/SettingsDialog";
import { EventToasts } from "@/components/EventToasts";
import { OfflineEarningsModal } from "@/components/OfflineEarningsModal";
import { ShareButtons } from "@/components/ShareButtons";
import { GameShell } from "@/components/layout/GameShell";
import { UpgradesPanel } from "@/components/Upgrades/UpgradesPanel";
import { ThemesPanel } from "@/components/Themes/ThemesPanel";
import { AchievementsPanel } from "@/components/Achievements/AchievementsPanel";
import { formatNumber } from "@/game/format";
import { getAwardDropRate } from "@/game/actions";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  const {
    state,
    isLoading,
    followersPerSecond,
    notorietyPerSecond,
    totalUpkeep,
    netFollowersPerSecond,
    canPrestige,
    reputationGain,
    handleBuyGenerator,
    handleBuyNotorietyGenerator,
    handleBuyUpgrade,
    handleBuyNotorietyUpgrade,
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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📱</div>
          <div className="text-xl font-semibold">Loading Clickfluencer...</div>
        </div>
      </div>
    );
  }

  const scrollToGame = () => {
    if (gameRef.current) gameRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Head>
        <Link rel="canonical" href="https://www.clickfluenceridle.com/" />
      </Head>

      {/* Splash Screen */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] px-6 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/10 via-surface/20 to-transparent blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Clickfluencer Idle
          </h1>

          <p className="text-lg text-muted mb-8 leading-relaxed">
            Build your influence, balance your strategy, and master the algorithmic grind.{" "}
            <strong className="text-foreground">Clickfluencer Idle</strong> is a cozy-chaotic
            idle experiment about progress, patience, and creativity in a world that never
            stops refreshing. You’ll click, automate, and optimize your way through the ups
            and downs of internet fame—<strong className="text-foreground">
              balancing the four distinct currencies
            </strong>{" "}
            that determine your strategic future. Every prestige choice tells its own story of
            growth, success, and self-discovery.
          </p>

          <div className="flex justify-center gap-4 flex-wrap mb-4">
            <Link
              href="/guide"
              className="px-6 py-3 rounded-lg bg-accent text-background font-semibold hover:opacity-90 transition"
            >
              Read the Guide
            </Link>
            <Link
              href="/news"
              className="px-6 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent/10 transition"
            >
              Latest Updates
            </Link>
          </div>

          {/* Trust Links */}
          <div className="flex justify-center gap-3 text-xs text-muted">
            <Link href="/privacy-policy" className="hover:text-accent transition">
              Privacy Policy
            </Link>
            <span>⋅</span>
            <Link href="/terms-of-service" className="hover:text-accent transition">
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Scroll to Game Button */}
        <motion.button
          onClick={scrollToGame}
          className="absolute bottom-8 flex flex-col items-center text-sm text-muted hover:text-accent transition"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0.8, 1] }}
          transition={{ delay: 1, duration: 3, repeat: Infinity }}
        >
          <span>Scroll to Game</span>
          <motion.svg
            className="mt-2 w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>
      </section>



      {/* Game Section */}
      <section ref={gameRef} className="mt-12 mb-16 pb-20 sm:pb-0">
        <EventToasts events={state.activeEvents} />

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

        <SettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={state.settings}
          onSettingChange={handleUpdateSetting}
          onExport={handleExportSave}
          onImport={handleImportSave}
          onReset={handleResetGame}
        />

        <GameShell
          currencyBar={
            <CurrencyBar
              followers={state.followers}
              shards={state.shards}
              awardDropRate={state ? getAwardDropRate(state) : 0.003}
              followersPerSecond={followersPerSecond}
              reputation={state.reputation}
              notoriety={state.notoriety ?? 0}
              notorietyPerSecond={notorietyPerSecond}
              totalUpkeep={totalUpkeep}
              netFollowersPerSecond={netFollowersPerSecond}
            />
          }
          quickStats={
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
          }
          shareButtons={
            <ShareButtons
              creds={state.followers}
              score={state.stats.totalFollowersEarned}
            />
          }
          generatorsTab={
            <GeneratorsPanel
              generators={state.generators}
              followers={state.followers}
              followersPerSecond={followersPerSecond}
              onBuyGenerator={handleBuyGenerator}
              state={state}
              onBuyNotorietyGenerator={handleBuyNotorietyGenerator}
            />
          }
          upgradesTab={
            <UpgradesPanel
              upgrades={state.upgrades}
              followers={state.followers}
              canPrestige={canPrestige}
              reputationGain={reputationGain}
              reputation={state.reputation}
              onBuyUpgrade={handleBuyUpgrade}
              onPrestige={handlePrestige}
              notoriety={state.notoriety || 0}
              state={state}
              onBuyNotorietyUpgrade={handleBuyNotorietyUpgrade}
            />
          }
          themesTab={
            <ThemesPanel
              themes={state.themes}
              shards={state.shards}
              activeThemeId={state.themes.find((t) => t.active)?.id || "dark"}
              onPurchaseTheme={handlePurchaseTheme}
              onActivateTheme={handleActivateTheme}
            />
          }
          achievementsTab={
            <AchievementsPanel achievements={state.achievements || []} />
          }
          settingsButton={
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
          }
          onShowSettings={() => setShowSettings(true)}
        >
          <div className="w-full max-w-md">
            <PostButton />
          </div>
        </GameShell>
      </section>
    </main>
  );
}
