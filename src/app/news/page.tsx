import { Metadata } from "next";
import changelog from "@/data/changelog.json";

export const metadata: Metadata = {
  title: "Game Updates - Clickfluencer Idle",
  description: "Stay up to date with the latest changes and updates to Clickfluencer Idle",
};

export default function NewsPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent mb-2">Game Updates</h1>
        <p className="text-muted">
          Check out the latest changes, features, and improvements to Clickfluencer Idle
        </p>
      </div>

      <div className="space-y-8">
        {changelog.map((entry) => (
          <article
            key={entry.version}
            className="bg-surface border border-border rounded-lg p-6 shadow-sm transition-colors"
          >
            <header className="mb-4 pb-4 border-b border-border">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="text-2xl font-semibold text-accent">
                  Version {entry.version}
                </h2>
                <time className="text-sm text-muted" dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/90">
                  <span className="text-accent mt-1.5 text-xs">▸</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-12 p-6 bg-surface border border-border rounded-lg text-center">
        <p className="text-muted">
          Have suggestions or found a bug?{" "}
          <a
            href="https://github.com/jpbranski/clickfluencer-idle/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Report it on GitHub
          </a>
        </p>
      </div>
    </main>
  );
}
