import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a Bug - Clickfluencer Idle",
  description: "Report bugs and issues with Clickfluencer Idle",
};

export default function ReportBugPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">Report a Bug</h1>

        <div className="space-y-6">
          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Found an Issue?</h2>
            <p className="text-muted mb-6">
              If you've encountered a bug or issue while playing Clickfluencer Idle, please report it on GitHub.
              Your reports help make the game better for everyone!
            </p>

            <a
              href="https://github.com/jpbranski/clickfluencer-idle/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Open GitHub Issues
            </a>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What to Include</h2>
            <p className="text-muted mb-4">
              To help me fix the issue quickly, please include:
            </p>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span><strong className="text-foreground">Description:</strong> What happened and what you expected to happen</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span><strong className="text-foreground">Steps to reproduce:</strong> How can I make the bug happen again?</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span><strong className="text-foreground">Browser & OS:</strong> Which browser and operating system you're using</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span><strong className="text-foreground">Screenshots:</strong> If applicable, screenshots help a lot!</span>
              </li>
            </ul>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Alternative Contact</h2>
            <p className="text-muted">
              If you prefer email or have questions about reporting, you can reach me at{" "}
              <a
                href="mailto:dev@jpbranski.com"
                className="text-accent hover:underline"
              >
                dev@jpbranski.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
