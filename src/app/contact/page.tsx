import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Clickfluencer Idle",
  description: "Get in touch with the Clickfluencer Idle team",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-accent mb-6">Contact & Support</h1>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <p className="text-muted text-lg leading-relaxed">
              Have feedback, found a bug, or just want to say hi? I'd love to hear
              from you. Clickfluencer Idle is an ongoing indie project built with
              Next.js, React, and a healthy amount of caffeine—your input helps make
              it better every update.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Ways to Reach Out</h2>
            <ul className="space-y-3 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">🌐</span>
                <div>
                  Website –{" "}
                  <a
                    href="https://jpbranski.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    jpbranski.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">💼</span>
                <div>
                  LinkedIn –{" "}
                  <a
                    href="https://www.linkedin.com/in/jonathanbranski"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    /jonathanbranski
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📧</span>
                <div>
                  Email –{" "}
                  <a href="mailto:dev@jpbranski.com" className="text-accent hover:underline">
                    dev@jpbranski.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">🐛</span>
                <div>
                  Report a Bug –{" "}
                  <a
                    href="https://github.com/jpbranski/clickfluencer-idle/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GitHub Issues Page
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Before You Reach Out</h2>
            <p className="text-muted leading-relaxed">
              If you're reporting a bug, please include as much detail as possible:
              what you were doing, your browser and device, and whether the problem
              happens consistently. Screenshots help a lot!
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">A Note About Saves</h2>
            <p className="text-muted leading-relaxed">
              Clickfluencer Idle stores all progress locally in your browser. There's
              no online account system—yet. If you switch devices or clear your cache,
              export your save file first using the in-game <strong className="text-foreground">Export</strong>{" "}
              feature. You can later import it on any browser to continue where you
              left off.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted leading-relaxed">
              Thank you for playing, sharing feedback, and helping shape this tiny
              world of algorithms, upgrades, and influencer chaos.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
