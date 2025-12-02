/**
 * uiStore.ts - Zustand UI State Store
 *
 * Manages UI-only state (modals, tabs, panels, etc.) separate from game state.
 * This prevents unnecessary re-renders when UI state changes.
 */

import { create } from "zustand";

// ============================================================================
// STORE INTERFACE
// ============================================================================

export interface UIStore {
  /** Currently active tab in the main game view */
  activeTab: "generators" | "upgrades" | "themes" | "achievements";

  /** Whether the settings modal is open */
  showSettings: boolean;

  /** Whether the FTUE (first-time user experience) tutorial is active */
  showTutorial: boolean;

  /** Current step in the FTUE tutorial (0-indexed) */
  tutorialStep: number;

  /** Whether the dev console is open (for debugging) */
  showDevConsole: boolean;

  /** Active generator filter (for filtering generator list) */
  generatorFilter: "all" | "affordable" | "owned";

  // Actions
  setActiveTab: (tab: UIStore["activeTab"]) => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
  startTutorial: () => void;
  nextTutorialStep: () => void;
  skipTutorial: () => void;
  toggleDevConsole: () => void;
  setGeneratorFilter: (filter: UIStore["generatorFilter"]) => void;
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  activeTab: "generators",
  showSettings: false,
  showTutorial: false,
  tutorialStep: 0,
  showDevConsole: false,
  generatorFilter: "all",

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),

  setShowSettings: (show) => set({ showSettings: show }),

  startTutorial: () =>
    set({
      showTutorial: true,
      tutorialStep: 0,
    }),

  nextTutorialStep: () =>
    set((state) => {
      const nextStep = state.tutorialStep + 1;
      // Tutorial has 3 steps (0, 1, 2), close after step 2
      if (nextStep >= 3) {
        return {
          showTutorial: false,
          tutorialStep: 0,
        };
      }
      return { tutorialStep: nextStep };
    }),

  skipTutorial: () =>
    set({
      showTutorial: false,
      tutorialStep: 0,
    }),

  toggleDevConsole: () => set((state) => ({ showDevConsole: !state.showDevConsole })),

  setGeneratorFilter: (filter) => set({ generatorFilter: filter }),
}));

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Selector hooks for efficient re-renders
 */

export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useShowSettings = () => useUIStore((state) => state.showSettings);
export const useTutorial = () =>
  useUIStore((state) => ({
    show: state.showTutorial,
    step: state.tutorialStep,
  }));
