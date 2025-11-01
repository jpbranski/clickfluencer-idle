import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Clickfluencer Idle",
  description: "Get in touch with the Clickfluencer Idle development team",
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent mb-2">Contact</h1>
        <p className="text-muted">
          Get in touch for feedback, bug reports, or collaboration inquiries
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Developer</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted mb-2">Website</h3>
              <a
                href="https://jpbranski.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-lg"
              >
                jpbranski.com
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted mb-2">Email</h3>
              <a
                href="mailto:dev@jpbranski.com"
                className="text-accent hover:underline text-lg"
              >
                dev@jpbranski.com
              </a>
            </div>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Report Issues</h2>
          <p className="text-foreground/90 mb-4">
            Found a bug or have a feature request? Report it on GitHub:
          </p>
          <a
            href="https://github.com/jpbranski/clickfluencer-idle/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub Issues
          </a>
        </section>
      </div>

      <section className="mt-6 bg-surface border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-accent mb-4">What to Include</h2>
        <p className="text-foreground/90 mb-4">
          When reaching out, please include the following information to help us assist you better:
        </p>
        <ul className="space-y-2 text-foreground/90">
          <li className="flex items-start gap-3">
            <span className="text-accent mt-1">•</span>
            <span><strong>Bug Reports:</strong> Describe what happened, what you expected, and steps to reproduce the issue</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent mt-1">•</span>
            <span><strong>Feature Requests:</strong> Explain the feature and how it would improve the game</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent mt-1">•</span>
            <span><strong>Collaboration:</strong> Share your ideas, background, and what you'd like to work on</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent mt-1">•</span>
            <span><strong>General Feedback:</strong> Let us know what you love or what could be improved</span>
          </li>
        </ul>
      </section>

      <section className="mt-6 bg-surface border border-border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-accent mb-4">Response Time</h2>
        <p className="text-foreground/90">
          This is a hobby project maintained by a solo developer. While we aim to respond to all
          inquiries, please allow a few days for a response. Critical bugs will be prioritized.
          Thank you for your patience and for playing Clickfluencer Idle!
        </p>
      </section>

      <section className="mt-6 bg-surface border border-border rounded-lg p-6 text-center">
        <p className="text-foreground/90 mb-4">
          Want to stay updated on the latest changes?
        </p>
        <a
          href="/news"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          View Game Updates
        </a>
      </section>
    </main>
  );
}
