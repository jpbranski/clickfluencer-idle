import { Metadata } from "next";
import Head from "next/head";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guide - Clickfluencer Idle",
  description:
    "Master Clickfluencer Idle: learn the mechanics, strategies, and systems that fuel your rise to social media stardom.",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <Head>
        <Link rel="canonical" href="https://www.clickfluenceridle.com/guide" />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className="text-heading-1 sm:text-display-2 mb-4"
              style={{
                background: "linear-gradient(135deg, var(--foreground) 0%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Complete Player Guide
            </h1>
            <p className="text-body-lg text-muted max-w-2xl mx-auto">
              Master the mechanics, strategies, and systems that fuel your rise to digital stardom.
            </p>
          </div>

          {/* Introduction */}
          <div className="card-premium p-8 mb-8">
            <p className="text-body text-muted leading-relaxed mb-4">
              Welcome to{" "}
              <strong className="text-foreground">Clickfluencer Idle</strong>,
              an idle-incremental game where your clicks shape an empire of
              influence. Every tap, every follower, and every viral moment is a
              step toward becoming the ultimate digital mogul. Whether you're a
              veteran of prestige systems or brand-new to idle games, this guide
              will help you understand not just how to play—but how to thrive.
            </p>

            <p className="text-body text-muted leading-relaxed">
              This document covers the game's fundamental mechanics, advanced
              progression strategies, prestige and notoriety systems, and a few
              subtle tricks from the dev team. Think of it as part strategy
              manual, part developer commentary. If you like seeing the numbers
              tick upward while experimenting with efficient build orders, you
              belong here.
            </p>
          </div>

          {/* How to Play */}
          <div className="card-premium p-8 mb-8">
            <h2 className="text-heading-3 text-foreground mb-4">
              How to Play
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              At its core, Clickfluencer Idle is about momentum. You start small
              with a single post button—the heartbeat of your fledgling brand.
              Each click earns{" "}
              <strong className="text-foreground">creds</strong>, the
              primary currency of growth. Spend those creds to unlock
              automated generators such as{" "}
              <em>Social Media Managers</em>, <em>Video Editors</em>, and
              <em> Sponsorship Deals</em> that produce creds for you over
              time.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Upgrades amplify your earnings, boost click power, and add
              multipliers to your production rate. You'll quickly learn that the
              idle genre isn't about doing nothing—it's about designing
              automation that works smarter than you can. Between active
              clicking bursts and passive income, your numbers climb at an
              exponential pace.
            </p>
            <p className="text-muted leading-relaxed">
              Once you've hit critical mass, you can{" "}
              <strong className="text-foreground">Prestige</strong>: a soft
              reset that converts your total creds into{" "}
              <strong className="text-foreground">Prestige Points</strong> and{" "}
              <strong className="text-foreground">Notoriety</strong>. These
              serve as permanent buffs that make each subsequent run faster,
              smoother, and more efficient. The key is learning when to stop a
              run—prestiging too early wastes potential, but waiting too long
              slows long-term growth.
            </p>
          </div>

          {/* Generators and Progression */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Generators, Upgrades, and Synergies
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Generators are the backbone of Clickfluencer Idle. Each generator
              type not only provides income but also interacts with others in
              subtle ways. For example, your{" "}
              <em>Content Creators</em> might benefit from brand partnerships
              that scale their output, while <em>Algorithm Gurus</em> can
              increase global follower gain percentages. Paying attention to
              these cross-boosts is what separates casual players from true
              optimizers.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Upgrades come in multiple tiers—standard, infinite, and thematic.
              Infinite upgrades like{" "}
              <strong className="text-foreground">AI Enhancements</strong> or{" "}
              <strong className="text-foreground">Better Filters</strong> offer
              endless scaling potential and remain through prestiges. Themes add
              visual flavor and minor bonuses to production or aesthetics. Don’t
              underestimate them: some players build entire prestige strategies
              around theme bonuses alone.
            </p>
            <p className="text-muted leading-relaxed">
              Efficiency is everything. Use the x10 purchase option to scale
              investments quickly, and prioritize upgrades that enhance global
              multipliers early. When in doubt, balance your portfolio: a
              healthy mix of click upgrades and passive generation ensures
              consistent exponential growth instead of stagnation.
            </p>
          </div>

          {/* Saving & Data */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Saving, Data, and Safety
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Your progress is stored automatically in your browser’s local
              storage. That means your empire lives on this device—and this
              device alone. Clearing cookies, switching browsers, or using
              private tabs will erase that save data. For security and
              flexibility, use the{" "}
              <strong className="text-foreground">Export Save</strong> and{" "}
              <strong className="text-foreground">Import Save</strong> options
              in the Settings panel. They allow you to transfer progress between
              machines or recover after reinstalling.
            </p>
            <p className="text-muted leading-relaxed">
              Clickfluencer Idle intentionally avoids online logins or cloud
              saves. It’s built for privacy and offline accessibility. Your
              empire belongs to you—no servers, no tracking, just the joy of
              watching exponential math turn into a social empire.
            </p>
          </div>

          {/* Advanced Strategy */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Advanced Strategy: The Art of Momentum
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              The most successful players think in cycles. Each prestige is a
              “run,” and every run is an experiment in efficiency. Start each
              cycle by buying inexpensive generators, then pivot into global
              multipliers as costs rise. The moment the follower curve flattens,
              it’s prestige time. Aim for smooth exponential arcs—not slow
              linear grinds.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Prestige currencies stack multiplicatively, so early-game patience
              pays massive late-game dividends. A single well-timed prestige can
              double your growth rate for the next five. Keep an eye on cost
              scaling: upgrades that seem trivial at first can compound
              hundreds-fold when layered with theme and notoriety bonuses.
            </p>
            <p className="text-muted leading-relaxed">
              Experimentation is encouraged. Some players focus on pure click
              power, others automate everything and let the system idle for
              hours. There’s no wrong path—only optimization paths that suit
              your playstyle. As updates roll out, new generators and prestige
              mechanics will introduce deeper meta-strategies to explore.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Developer Tips & Fun Facts
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                Buy generators early—they scale aggressively and unlock upgrade
                tiers faster.
              </li>
              <li>
                Save awards for infinite upgrades; they persist across prestiges
                and yield compounding returns.
              </li>
              <li>
                Switching themes can refresh your motivation—each one subtly
                alters the vibe and pacing of play.
              </li>
              <li>
                The game saves automatically every few seconds. Manual export is
                only needed before device swaps or major resets.
              </li>
              <li>
                Behind the scenes, Clickfluencer Idle's math engine is
                deterministic, meaning your offline earnings are calculated from
                exact timestamps—no random fudge factor.
              </li>
              <li>
                The game's balance values were tuned to make even tiny upgrades
                feel rewarding. If numbers jump faster than expected, that's not
                a bug—it's intentional dopamine.
              </li>
            </ul>
          </div>

          {/* Closing */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted leading-relaxed mb-4">
              Clickfluencer Idle is meant to be more than a time-killer—it’s a
              slow-burn creative experiment about digital fame, algorithmic
              power, and our obsession with growth metrics. By blending the
              chill pacing of incremental games with the humor of social media
              satire, it invites you to laugh at the same systems you’re gaming.
            </p>
            <p className="text-muted leading-relaxed">
              Whether you're chasing prestige milestones or designing the
              perfect content workflow, remember: every empire started with a
              single post. Keep clicking, keep experimenting, and enjoy the
              climb—your creds are waiting.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
