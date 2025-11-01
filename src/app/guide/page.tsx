import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide - Clickfluencer Idle",
  description: "Learn how to play Clickfluencer Idle and become the ultimate digital influencer",
};

export default function GuidePage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent mb-2">How to Play</h1>
        <p className="text-muted">
          Master the art of social media influence with this comprehensive guide
        </p>
      </div>

      <article className="prose prose-invert max-w-none">
        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Getting Started</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Welcome to <strong>Clickfluencer Idle</strong>, an incremental idle game where you build
            your social media empire from scratch. Start by clicking the "Post Content" button to gain
            followers. Each click represents creating and sharing content with your growing audience.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            As you accumulate followers, you'll unlock the ability to purchase generators - automated
            systems that generate followers for you even when you're not actively clicking. This is the
            core of idle gameplay: passive progression that continues even when you step away.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Generators & Automation</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Generators are your primary tool for automation. Each generator produces a certain number
            of followers per second. As you purchase more of the same generator, their cost increases,
            but so does your total production. Strategic purchases are key to maximizing your growth rate.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Focus on purchasing generators that offer the best followers-per-second relative to their
            cost. Early game generators are affordable but less powerful, while later generators require
            massive investment but provide exponential returns.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Upgrades & Multipliers</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Upgrades provide permanent bonuses to your click power or generator efficiency. These
            multipliers compound over time, making them essential for long-term progression. Some
            upgrades are one-time purchases, while others can be bought repeatedly for stacking effects.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Pay attention to upgrade descriptions - some boost specific generators, while others provide
            global bonuses. Prioritize upgrades that align with your current strategy and generator setup.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">The Prestige System</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Once you've accumulated enough followers, you can <strong>prestige</strong> - resetting
            your progress in exchange for Reputation Shards. These shards are a premium currency that
            unlocks powerful permanent upgrades and cosmetic themes.
          </p>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Prestiging resets your followers and generators but keeps your reputation-based upgrades,
            allowing you to progress faster on subsequent runs. The key to efficient prestiging is
            timing - wait until your growth has slowed significantly before resetting.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Reputation Shards can be spent on prestige upgrades that provide global multipliers, making
            each reset more rewarding than the last. This creates a satisfying loop of growth, reset,
            and accelerated re-growth.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Cloud Saving & Themes</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Your progress is automatically saved to your browser every 30 seconds. If you create an
            account by signing in with Google, Discord, or Steam, your save will also sync to the cloud
            every 5 minutes and whenever you make significant progress like purchasing upgrades or prestiging.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Unlock cosmetic themes using Reputation Shards to personalize your experience. Each theme
            offers a unique color palette and visual style, from sleek dark mode to vibrant cherry blossom
            aesthetics. Once unlocked, themes can be activated at any time from the settings menu.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Tips for Success</h2>
          <ul className="space-y-3 text-foreground/90">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>In the early game, focus on clicking and purchasing your first few generators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Buy upgrades as soon as they become affordable - they provide exponential value</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Don't prestige too early - wait until your progression slows to a crawl</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Check back regularly to take advantage of offline progress bonuses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Experiment with different generator combinations to find optimal strategies</span>
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
