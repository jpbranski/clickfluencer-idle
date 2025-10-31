"use client";

import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 transition-colors">
      <nav className="max-w-3xl mx-auto mb-6 border-b border-border pb-3 flex justify-center gap-6 text-sm flex-wrap">
        <Link href="/" className="text-accent hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/acknowledgements" className="hover:underline">Acknowledgements</Link>
        <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
      </nav>

      <div className="max-w-3xl mx-auto bg-card backdrop-blur-sm border border-border rounded-2xl shadow-xl p-8 md:p-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
            📜 Terms of Service
          </h1>
          <p className="text-muted text-sm">
            for <strong>Clickfluencer Idle</strong> · Effective Date: October
            31, 2025
          </p>
        </header>

        <section className="space-y-8 text-foreground leading-relaxed">
          {/* Intro */}
          <p>
            These Terms of Service (“Terms”) constitute a legally binding
            agreement between Jonathan “JP” Branski (“We,” “Us,” or “Our”) and
            you (“User” or “You”) governing your access to and use of the
            Clickfluencer Idle browser game and related services (the
            “Service”).
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">1. Acceptance of Terms</h2>
            <p>
              By clicking to accept these Terms, or by accessing, using, or
              playing the Service, you confirm that you have read, understood,
              and agree to be bound by these Terms and our Privacy Policy. If
              you do not agree, you must discontinue use immediately.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              2. Grant of Limited License
            </h2>
            <p>
              We grant you a personal, non-exclusive, non-transferable,
              non-sublicensable, revocable limited license to use and enjoy the
              Service solely for individual, non-commercial, entertainment
              purposes, in accordance with these Terms.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              3. Virtual Content and In-Game Currency
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>No Monetary Value:</strong> All Virtual Content has no
                monetary value and cannot be redeemed for real-world currency,
                goods, or services.
              </li>
              <li>
                <strong>License Only:</strong> When you acquire any Virtual
                Content, you receive a limited license to use it within the
                Service — not ownership of it.
              </li>
              <li>
                <strong>Non-Transferable:</strong> Virtual Content may not be
                transferred, sold, or exchanged outside of the Service.
              </li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              4. User Conduct and Prohibitions
            </h2>
            <p>
              You agree not to engage in the following prohibited activities:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Using or distributing cheats, bots, or exploit programs.</li>
              <li>
                Attempting to reverse engineer, decompile, or disassemble the
                Service.
              </li>
              <li>
                Accessing non-public areas or systems without authorization.
              </li>
              <li>Introducing viruses, worms, or other harmful material.</li>
              <li>
                Buying or selling accounts or items for real-world currency
                (RMT).
              </li>
              <li>Impersonating another user or any Service employee.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate access for violations
              without notice or liability.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              5. Intellectual Property Rights
            </h2>
            <p>
              The Service, including its logic, graphics, design, characters
              (including the name “Clickfluencer Idle”), and all code, are owned
              by Jonathan “JP” Branski and protected by copyright and
              intellectual-property laws. You may not copy, reproduce, modify,
              distribute, or create derivative works without written permission.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              6. Termination of Service
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>By You:</strong> You may stop using the Service at any
                time. Contact us to permanently delete your game data.
              </li>
              <li>
                <strong>By Us:</strong> We may suspend or terminate access at
                any time for any reason, including breaches of these Terms. All
                Virtual Content licenses will be revoked upon termination and
                are non-refundable.
              </li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              7. Disclaimer of Warranties & Limitation of Liability
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>“AS IS”:</strong> The Service is provided “AS IS” and
                “AS AVAILABLE,” with no warranties of any kind, express or
                implied.
              </li>
              <li>
                <strong>Limitation:</strong> To the fullest extent permitted by
                law, Jonathan “JP” Branski shall not be liable for indirect,
                incidental, or consequential damages, or loss of profits arising
                from your use of the Service.
              </li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              8. Governing Law & Contact Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Governing Law:</strong> These Terms are governed by the
                laws of Milwaukee, Wisconsin, USA, without regard to
                conflict-of-law principles.
              </li>
              <li>
                <strong>Contact Information:</strong>
                <div className="mt-2 pl-4">
                  <p>
                    Developer Name: Jonathan “JP” Branski
                    <br />
                    Email:{" "}
                    <a
                      href="mailto:dev@jpbranski.com"
                      className="text-accent underline"
                    >
                      dev@jpbranski.com
                    </a>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <footer className="pt-8 border-t border-border text-sm text-muted text-center">
            © {new Date().getFullYear()} Jonathan Branski · All Rights Reserved
          </footer>
        </section>
      </div>
    </main>
  );
}
