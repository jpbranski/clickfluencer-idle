'use client';

import { useEffect, useState } from 'react';

// Import game components (to be created)
// import { ClickerPanel } from '@/components/ClickerPanel';
// import { GeneratorPanel } from '@/components/GeneratorPanel';
// import { StatsPanel } from '@/components/StatsPanel';
// import { UpgradesPanel } from '@/components/UpgradesPanel';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">📱</div>
          <div className="text-xl font-semibold">Loading Clickfluencer...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Clickfluencer Idle
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build Your Social Media Empire
          </p>
        </header>

        {/* Main Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Clicker & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clicker Panel - Primary interaction */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Tap to Grow
              </h2>
              <div className="flex flex-col items-center justify-center space-y-4">
                <button
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all shadow-xl text-white text-4xl font-bold"
                  aria-label="Click to gain followers"
                >
                  👆
                </button>
                <div className="text-center">
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Followers
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Stats</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Per Click:
                  </span>
                  <span className="font-semibold">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Per Second:
                  </span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Clicks:
                  </span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Generators */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Content Generators</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">📸 Photo Post</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      0.1/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cost: 10 followers
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded text-sm"
                      disabled
                    >
                      Buy
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">🎥 Video Content</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      1.0/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cost: 100 followers
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded text-sm"
                      disabled
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Upgrades */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Upgrades</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-50">
                  <div className="font-semibold mb-2">💪 Better Content</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Double your click power
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cost: 50 followers
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded text-sm"
                      disabled
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Clickfluencer Idle v0.1.0 - Built with Next.js</p>
        </footer>
      </div>
    </main>
  );
}