import { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates - Clickfluencer Idle",
  description: "Latest updates and changes to Clickfluencer Idle",
};

export default function NewsPage() {
  const updates = [
    {
      version: "0.1.0",
      date: "2025-11-01",
      title: "Initial Release",
      changes: [
        "Launch of Clickfluencer Idle",
        "Core clicking mechanics",
        "6 content generators",
        "Multiple upgrades",
        "9 unlockable themes",
        "Prestige system",
        "Offline earnings",
        "Local save system",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">News & Updates</h1>

        <div className="space-y-6">
          {updates.map((update) => (
            <article key={update.version} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{update.title}</h2>
                  <p className="text-sm text-muted mt-1">
                    Version {update.version} • {new Date(update.date).toLocaleDateString()}
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
            Stay tuned for more updates and features!
          </p>
        </div>
      </div>
    </main>
  );
}
