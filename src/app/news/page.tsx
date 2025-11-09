import { Metadata } from "next";
import changelog from "@/data/changelog.json";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News & Updates - Clickfluencer Idle",
  description: "Latest updates and development logs for Clickfluencer Idle.",
};

type ChangelogEntry = {
  version: string;
  slug: string;
  date: string;
  title: string;
  description?: string;
  changes: string[];
};

export default function NewsPage() {
  const updates: ChangelogEntry[] = [...changelog].reverse(); // ✅ newest first

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-3">News & Updates</h1>
        <p className="text-muted mb-8 max-w-2xl">
          Follow Clickfluencer Idle’s development journey—patch notes,
          design overhauls, and feature drops straight from the devs.
        </p>

        <div className="space-y-6">
          {updates.map((update) => (
            <article
              key={update.slug}
              className="bg-card rounded-lg p-6 border border-border hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    <Link
                      href={`/news/${update.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {update.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    Version {update.version} •{" "}
                    {new Date(update.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  v{update.version}
                </span>
              </div>

              {update.description && (
                <p className="text-sm text-muted mb-4 leading-relaxed">
                  {update.description}
                </p>
              )}

              <ul className="list-disc pl-6 space-y-1 text-muted">
                {update.changes.slice(0, 3).map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>

              <div className="mt-4 text-right">
                <Link
                  href={`/news/${update.slug}`}
                  className="text-accent text-sm hover:underline"
                >
                  Read full update →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
