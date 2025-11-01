import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guide - Clickfluencer Idle",
  description: "Learn how to play Clickfluencer Idle and become a social media mogul",
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-accent mb-6">Clickfluencer Idle – Getting Started</h1>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <p className="text-muted text-lg leading-relaxed">
              Welcome to <strong className="text-foreground">Clickfluencer Idle</strong>, the incremental game about
              building your social media empire one tap at a time. Each click earns
              you clout and followers. Spend those followers on new generators,
              upgrades, and creative tools to grow your digital reach faster than ever.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How to Play</h2>
            <p className="text-muted leading-relaxed">
              Start by clicking the main post button to earn followers manually. Soon
              you'll unlock automated generators—like editors, bots, and brand
              sponsors—that create posts for you over time. Upgrades improve your
              efficiency, click power, and follower gain rates. As your numbers rise,
              you'll prestige to gain shards and reputation, permanently boosting
              future runs.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Saving & Data</h2>
            <p className="text-muted leading-relaxed mb-4">
              Your progress is saved automatically in your browser's local storage.
              This means your game is stored <em>only</em> on this device. Clearing
              cookies or using private browsing will erase your progress. You can,
              however, safely export your save data at any time and import it back
              later from another device or after reinstalling.
            </p>
            <p className="text-muted leading-relaxed">
              To back up your progress, open the settings panel and select{" "}
              <strong className="text-foreground">Export Save</strong> to download your data file. You can restore
              it anytime using the <strong className="text-foreground">Import Save</strong> option.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Tips & Strategy</h2>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Buy generators early—they scale fast.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Save shards for major prestige upgrades.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Experiment with different visual themes to personalize your empire.</span>
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted leading-relaxed">
              Clickfluencer Idle was designed to be a laid-back growth experience:
              part numbers game, part creative experiment. Build your clout, go viral,
              and above all—have fun watching those numbers climb.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
