"use client";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 md:p-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
            🔒 Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            for <strong>Clickfluencer Idle (Browser / Web)</strong> · Effective
            Date: October 31, 2025
          </p>
        </header>

        <section className="space-y-8 text-gray-800 dark:text-gray-100 leading-relaxed">
          {/* Intro */}
          <p>
            This Privacy Policy describes how Jonathan “JP” Branski (“We,” “Us,”
            or “Our”) collects, uses, and discloses information from users of
            the “Clickfluencer Idle” browser game (the “Service”).
          </p>

          {/* 1. Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect only the data necessary to operate, improve, and
              monetize the Service.
            </p>

            <h3 className="mt-4 font-semibold text-lg">
              A. Information You Provide Directly (Game Data)
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Game Progress:</strong> Your high score, in-game
                currency, upgrade history, and other gameplay statistics.
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Purpose: To save your game progress and analyze game balance.
                </span>
              </li>
              <li>
                <strong>Unique Identifier:</strong> A unique, non-personal ID
                stored locally in your browser for saving progress.
              </li>
            </ul>

            <h3 className="mt-4 font-semibold text-lg">
              B. Information Collected Automatically (Analytics, Advertising,
              and Tracking)
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Device and Browser Information:</strong> IP address,
                browser type, OS, screen resolution, time zone.
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Purpose: To ensure the game runs correctly and for geographic
                  analysis.
                </span>
              </li>
              <li>
                <strong>Usage Data:</strong> Pages viewed, in-game interactions,
                time spent.
              </li>
              <li>
                <strong>
                  Tracking Technologies (Cookies & Local Storage):
                </strong>{" "}
                Used to save preferences and deliver personalized ads.
              </li>
            </ul>
          </div>

          {/* 2. How We Use Your Information */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To operate the game and save progress (Local Storage / Cookies).
              </li>
              <li>To analyze usage trends and improve the experience.</li>
              <li>
                To display advertisements that support the free version of the
                game.
              </li>
            </ul>
          </div>

          {/* 3. Third Parties */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              3. Third-Party Service Providers (Google Ads & Analytics)
            </h2>
            <p>
              We integrate third-party services that process data subject to
              their own policies. By using the Service, you consent to this
              processing.
            </p>

            <h3 className="mt-4 font-semibold text-lg">
              A. Google Ads (Advertising)
            </h3>
            <p>
              Google uses cookies to deliver and measure ads, including
              personalized ads. See
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="text-purple-600 dark:text-purple-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google’s Privacy Policy
              </a>
              .
            </p>

            <h3 className="mt-4 font-semibold text-lg">
              B. Google Analytics (Statistics)
            </h3>
            <p>
              We use Analytics to understand usage patterns and improve
              gameplay. See
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="text-purple-600 dark:text-purple-400 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google’s Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* 4. Rights */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              4. Your Rights and Choices (Opt-Out)
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Managing Cookies:</strong> You can disable cookies in
                your browser, but this may affect game functionality.
              </li>
              <li>
                <strong>Opt-Out of Ads:</strong> Visit Google’s
                <a
                  href="https://adssettings.google.com"
                  className="text-purple-600 dark:text-purple-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ads Settings
                </a>{" "}
                page.
              </li>
              <li>
                <strong>Access / Deletion Requests:</strong> Contact us to
                review or erase data tied to your unique game ID.
              </li>
            </ul>
          </div>

          {/* 5. Children */}
          <div>
            <h2 className="text-2xl font-bold mb-2">5. Children’s Privacy</h2>
            <p>
              The Service is not intended for children under 13, and we do not
              knowingly collect their data. Contact us if you believe we have
              done so inadvertently.
            </p>
          </div>

          {/* 6. Contact */}
          <div>
            <h2 className="text-2xl font-bold mb-2">6. Contact Us</h2>
            <address className="not-italic space-y-1">
              <p>
                <strong>Developer Name:</strong> Jonathan “JP” Branski
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:dev@jpbranski.com"
                  className="text-purple-600 dark:text-purple-400 underline"
                >
                  dev@jpbranski.com
                </a>
              </p>
              <p>
                <strong>Mailing Address:</strong> Milwaukee, Wisconsin, USA
              </p>
            </address>
          </div>

          <footer className="pt-8 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Jonathan Branski · All Rights Reserved
          </footer>
        </section>
      </div>
    </main>
  );
}
