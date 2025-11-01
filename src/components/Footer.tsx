"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Acknowledgements", href: "/acknowledgements" },
    { label: "Guide", href: "/guide" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Report Bug", href: "/report-bug" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  return (
    <footer className="w-full mt-auto bg-surface border-t border-border text-foreground transition-colors">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-3 text-sm" aria-label="Footer navigation">
          {links.map((link, index) => (
            <span key={link.href} className="flex items-center gap-3">
              <Link
                href={link.href}
                className="hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
              {index < links.length - 1 && (
                <span className="text-muted" aria-hidden="true">•</span>
              )}
            </span>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted text-center mt-4">
          © {currentYear} Clickfluencer Idle. All rights reserved.
        </p>

        {/* Version Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-muted">
            <span
              className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"
              aria-label="status indicator"
            />
            <span>v0.1.0 Early Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
