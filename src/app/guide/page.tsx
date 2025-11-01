import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide - Clickfluencer Idle",
  description: "Learn how to play Clickfluencer Idle and become a social media mogul",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">Beginner's Guide</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Getting Started</h2>
            <p className="text-muted mb-4">
              Welcome to Clickfluencer Idle! This is an incremental idle game where you build your social media empire
              from scratch. Start by clicking the post button to gain followers, then use those followers to unlock
              automated content generators.
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Core Mechanics</h2>
            <ul className="space-y-3 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">📱</span>
                <div>
                  <strong className="text-foreground">Clicking:</strong> Each click earns you followers based on your click power.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📈</span>
                <div>
                  <strong className="text-foreground">Generators:</strong> Purchase automated content systems to generate followers passively over time.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">⚡</span>
                <div>
                  <strong className="text-foreground">Upgrades:</strong> Unlock permanent improvements to boost your production and click power.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">🎨</span>
                <div>
                  <strong className="text-foreground">Themes:</strong> Spend awards to unlock cosmetic themes with permanent bonuses.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">⭐</span>
                <div>
                  <strong className="text-foreground">Prestige:</strong> Reset your progress to gain reputation, which provides a permanent production multiplier.
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Start by purchasing your first few generators to automate follower generation</li>
              <li>Balance between clicking manually and purchasing generators</li>
              <li>Awards drop randomly from clicks - collect them to unlock themes</li>
              <li>Prestige when available to gain permanent bonuses</li>
              <li>Theme bonuses are permanent once unlocked, even when inactive</li>
              <li>Your progress is saved locally in your browser automatically</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Offline Progress</h2>
            <p className="text-muted">
              The game continues to generate followers while you're away! When you return, you'll receive a summary
              of your offline earnings based on your passive generation rate.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
