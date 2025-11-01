import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact - Clickfluencer Idle",
  description: "Get in touch with the Clickfluencer Idle team",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">Contact</h1>

        <div className="space-y-6">
          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Get In Touch</h2>
            <p className="text-muted mb-6">
              I'd love to hear from you! Whether you have feedback, questions, bug reports, or just want to say hi,
              feel free to reach out.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-accent">📧</span>
                <div>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a
                    href="mailto:dev@jpbranski.com"
                    className="text-accent hover:underline"
                  >
                    dev@jpbranski.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-accent">🌐</span>
                <div>
                  <strong className="text-foreground">Website:</strong>{" "}
                  <a
                    href="https://jpbranski.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    jpbranski.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="text-accent">🐛</span>
                <div>
                  <strong className="text-foreground">Report Bugs:</strong>{" "}
                  <Link href="/report-bug" className="text-accent hover:underline">
                    Bug Report Page
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What to Expect</h2>
            <p className="text-muted mb-4">
              I typically respond to emails within 1-3 business days. For bug reports, please use the
              dedicated bug report page to help me track and prioritize issues effectively.
            </p>
            <p className="text-muted">
              Your feedback helps make Clickfluencer Idle better for everyone!
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
