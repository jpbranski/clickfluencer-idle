import { Metadata } from "next";
import changelog from "@/data/changelog.json";
import Head from "next/head";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Updates - Clickfluencer Idle",
  description: "Latest updates and changes to Clickfluencer Idle",
};

type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export default function NewsPage() {
  const updates: ChangelogEntry[] = changelog;

  return (
    <main className="min-h-screen bg-background">
      <Head>
        <Link rel="canonical" href="https://www.clickfluenceridle.com/news" />
      </Head>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">News & Updates</h1>

        <div className="space-y-6">
          {updates.map((update) => (
            <article key={update.version} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{update.title}</h2>
                  <p className="text-sm text-muted mt-1">
                    Version {update.version} • {new Date(update.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  v{update.version}
                </span>
              </div>

              <ul className="space-y-2">
                {update.changes.map((change, idx) => (
                  <li key={idx} className="flex gap-3 text-muted">
                    <span className="text-accent mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-surface rounded-lg p-6 border border-border text-center">
          <p className="text-muted">
            Stay tuned for more updates and features! Follow development progress and report issues on{" "}
            <a
              href="https://github.com/jpbranski/clickfluencer-idle"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
