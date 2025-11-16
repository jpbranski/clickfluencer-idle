"use client";

/**
 * FTUEModal - First-Time User Experience Onboarding
 *
 * Features:
 * - Step-by-step tutorial
 * - Skippable
 * - "Don't show again" option
 * - Keyboard navigable
 * - Semi-transparent overlay
 * - Respects prefers-reduced-motion
 */

import { useState } from "react";

export interface FTUEModalProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  icon: string;
  highlight?: string; // Optional CSS selector to highlight
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Clickfluencer Idle!",
    description: "Build your social media empire by clicking to gain creds and purchasing generators to automate your growth.",
    icon: "👋",
  },
  {
    title: "Click to Gain Creds",
    description: "Click or tap the main area to gain creds. Your click power increases as you purchase upgrades and progress through the game.",
    icon: "👆",
  },
  {
    title: "Track Your Resources",
    description: "Keep an eye on your Creds (💰), Awards (💎), Prestige (🔱), and Notoriety (😎) at the top of the screen.",
    icon: "📊",
  },
  {
    title: "Purchase Generators",
    description: "Generators automatically produce creds every second. Start with Photo Posts and unlock more advanced content types as you grow.",
    icon: "📸",
  },
  {
    title: "Buy Upgrades",
    description: "Upgrades provide permanent bonuses to your click power and generator production. Some upgrades have multiple tiers!",
    icon: "🔧",
  },
  {
    title: "Unlock Prestige",
    description: "Once you've accumulated enough creds, you can prestige to gain permanent multipliers. Prestige doesn't reset your progress in this game!",
    icon: "🔱",
  },
  {
    title: "You're Ready!",
    description: "That's all you need to know to get started. Have fun building your influencer empire!",
    icon: "🎉",
  },
];

export function FTUEModal({ onComplete, onSkip }: FTUEModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const step = TUTORIAL_STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      onComplete(); // Mark as completed so it doesn't show again
    } else {
      onSkip();
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && !isLastStep) {
      handleNext();
    } else if (e.key === "ArrowLeft" && !isFirstStep) {
      handlePrevious();
    } else if (e.key === "Escape") {
      handleSkip();
    } else if (e.key === "Enter") {
      handleNext();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ftue-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Modal Container */}
      <div className="relative max-w-lg w-full mx-4 bg-surface border-2 border-accent rounded-lg shadow-2xl p-6 md:p-8">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex gap-1 mb-2">
            {TUTORIAL_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-muted text-right">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          {/* Icon */}
          <div className="text-6xl mb-4">{step.icon}</div>

          {/* Title */}
          <h2
            id="ftue-title"
            className="text-2xl font-bold text-foreground mb-3"
          >
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-base text-muted leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Main Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={isFirstStep}
              className={`
                flex-1 px-4 py-2 rounded-lg font-medium transition-all
                ${
                  isFirstStep
                    ? "bg-surface/50 text-muted/50 cursor-not-allowed"
                    : "bg-surface text-foreground hover:bg-surface/80 border border-border"
                }
              `}
              aria-label="Previous step"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 rounded-lg font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-md"
              aria-label={isLastStep ? "Finish tutorial" : "Next step"}
            >
              {isLastStep ? "Get Started! 🎉" : "Next →"}
            </button>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Skip Tutorial
          </button>

          {/* Don't Show Again Checkbox */}
          {isFirstStep && (
            <label className="flex items-center justify-center gap-2 text-sm text-muted cursor-pointer hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-surface accent-accent"
              />
              <span>Don't show this again</span>
            </label>
          )}
        </div>

        {/* Keyboard Hints */}
        <div className="mt-6 pt-4 border-t border-border text-xs text-muted text-center">
          <kbd className="px-2 py-1 bg-surface/50 rounded border border-border">←</kbd>{" "}
          <kbd className="px-2 py-1 bg-surface/50 rounded border border-border">→</kbd>{" "}
          to navigate •{" "}
          <kbd className="px-2 py-1 bg-surface/50 rounded border border-border">Esc</kbd>{" "}
          to skip
        </div>
      </div>
    </div>
  );
}
