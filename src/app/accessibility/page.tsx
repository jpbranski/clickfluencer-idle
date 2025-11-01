import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility - Clickfluencer Idle",
  description: "Accessibility features and information for Clickfluencer Idle",
};

export default function AccessibilityPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4 min-h-screen bg-background text-foreground">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent mb-2">Accessibility</h1>
        <p className="text-muted">
          We strive to make Clickfluencer Idle accessible to all players
        </p>
      </div>

      <article className="space-y-6">
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Color Contrast & Themes</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            Clickfluencer Idle includes multiple theme options to accommodate different visual
            preferences and needs. All themes are designed with WCAG 2.1 AA color contrast standards
            in mind to ensure text readability.
          </p>
          <ul className="space-y-2 text-foreground/90">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Dark Mode:</strong> High contrast with light text on dark backgrounds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Light Mode:</strong> Traditional light theme with dark text on light backgrounds</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Additional Themes:</strong> Unlock more themes with varied color palettes using Reputation Shards</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Motion & Animation</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            The game respects your system's motion preferences. If you have enabled "Reduce Motion"
            in your operating system settings, animations will be minimized or disabled automatically.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            CSS animations and transitions are designed to be subtle and non-distracting, with smooth
            easing functions that avoid jarring movements.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Keyboard Navigation</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            All interactive elements in Clickfluencer Idle can be accessed via keyboard navigation.
            Key features include:
          </p>
          <ul className="space-y-2 text-foreground/90">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Tab Navigation:</strong> Press Tab to move between interactive elements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Enter/Space:</strong> Activate buttons and controls</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Escape:</strong> Close modals and dialogs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span><strong>Focus Indicators:</strong> Clear visual indicators show which element has keyboard focus</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Screen Reader Support</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            We use semantic HTML and ARIA labels to ensure screen reader compatibility:
          </p>
          <ul className="space-y-2 text-foreground/90">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Proper heading hierarchy for easy navigation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>ARIA labels on interactive elements and dynamic content</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Live regions announce important game state changes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Alternative text for all meaningful images and icons</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Font & Text Sizing</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            The interface uses responsive typography that scales with your browser's zoom level.
            All text can be enlarged up to 200% without loss of functionality or content.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Font sizes are defined in relative units (rem/em) rather than fixed pixels, ensuring
            they respect your browser and system font size preferences.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Mobile & Touch Support</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            The game is fully responsive and touch-friendly:
          </p>
          <ul className="space-y-2 text-foreground/90">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Large touch targets (minimum 44x44 pixels) for easy tapping</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Responsive layout adapts to all screen sizes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>Swipe gestures for navigation where appropriate</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-1">•</span>
              <span>No hover-dependent functionality that would be inaccessible on touch devices</span>
            </li>
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Feedback & Improvements</h2>
          <p className="text-foreground/90 leading-relaxed mb-4">
            We are continuously working to improve accessibility. If you encounter any barriers or
            have suggestions for making the game more accessible, please reach out:
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:dev@jpbranski.com"
              className="text-accent hover:underline inline-flex items-center gap-2"
            >
              Email: dev@jpbranski.com
            </a>
            <a
              href="https://github.com/jpbranski/clickfluencer-idle/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline inline-flex items-center gap-2"
            >
              GitHub Issues
            </a>
          </div>
        </section>

        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Standards Compliance</h2>
          <p className="text-foreground/90 leading-relaxed">
            This game aims to meet WCAG 2.1 Level AA standards. We use modern web technologies
            including semantic HTML5, CSS3, and JavaScript with progressive enhancement to ensure
            a baseline experience for all users regardless of their technology or abilities.
          </p>
        </section>
      </article>
    </main>
  );
}
