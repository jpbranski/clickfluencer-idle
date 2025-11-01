import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility - Clickfluencer Idle",
  description: "Accessibility features and commitment for Clickfluencer Idle",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-accent mb-6">Accessibility</h1>

        <div className="space-y-6">
          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted mb-4">
              Clickfluencer Idle is committed to ensuring digital accessibility for people with disabilities.
              I am continually improving the user experience for everyone and applying relevant accessibility standards.
            </p>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Current Features</h2>
            <ul className="space-y-3 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">🎨</span>
                <div>
                  <strong className="text-foreground">Theme Support:</strong> Multiple themes including high-contrast options for better visibility
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">⌨️</span>
                <div>
                  <strong className="text-foreground">Keyboard Navigation:</strong> All interactive elements are accessible via keyboard
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">📱</span>
                <div>
                  <strong className="text-foreground">Responsive Design:</strong> Works across all device sizes and screen orientations
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">🔤</span>
                <div>
                  <strong className="text-foreground">Clear Typography:</strong> Readable fonts and appropriate contrast ratios
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">🏷️</span>
                <div>
                  <strong className="text-foreground">Semantic HTML:</strong> Proper use of headings, labels, and ARIA attributes
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-2 text-muted">
              <p className="mb-3">You can navigate the game using these keyboard controls:</p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <code className="px-2 py-1 bg-surface rounded text-accent">Tab</code>
                  <span>Navigate between interactive elements</span>
                </li>
                <li className="flex gap-3">
                  <code className="px-2 py-1 bg-surface rounded text-accent">Enter/Space</code>
                  <span>Activate buttons and links</span>
                </li>
                <li className="flex gap-3">
                  <code className="px-2 py-1 bg-surface rounded text-accent">Esc</code>
                  <span>Close modals and dialogs</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Known Limitations</h2>
            <p className="text-muted mb-4">
              While I strive for full accessibility, there may be areas that need improvement. I am actively working to:
            </p>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Improve screen reader compatibility and announcements</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Add more customization options for text size and spacing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Enhance focus indicators for better keyboard navigation visibility</span>
              </li>
            </ul>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Feedback</h2>
            <p className="text-muted mb-4">
              I welcome your feedback on the accessibility of Clickfluencer Idle. If you encounter any accessibility
              barriers or have suggestions for improvement, please contact me:
            </p>
            <div className="space-y-2">
              <div className="flex gap-3 text-muted">
                <span className="text-accent">📧</span>
                <div>
                  Email: <a href="mailto:dev@jpbranski.com" className="text-accent hover:underline">dev@jpbranski.com</a>
                </div>
              </div>
              <div className="flex gap-3 text-muted">
                <span className="text-accent">🐛</span>
                <div>
                  GitHub: <a href="https://github.com/jpbranski/clickfluencer-idle/issues" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Report an Issue</a>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Technical Specifications</h2>
            <ul className="space-y-2 text-muted">
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Built with modern web standards (HTML5, CSS3, JavaScript)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Tested on latest versions of Chrome, Firefox, Safari, and Edge</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>Mobile-friendly and touch-optimized</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">•</span>
                <span>No external authentication or tracking required</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
