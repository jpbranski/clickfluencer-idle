"use client";

import Link from "next/link";
import { useState } from "react";
import newsItems from "@/data/news.json"; // ✅ import your news data

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Acknowledgements", href: "/acknowledgements" },
    { name: "Guide", href: "/guide" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-surface text-foreground border-b border-border shadow-sm fixed top-0 left-0 z-50 transition-colors">
      {/* Top nav */}
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-xl font-bold text-accent hover:opacity-80 transition-opacity"
        >
          Clickfluencer Idle
        </Link>

        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground hover:text-accent transition-colors"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* 📰 Marquee News Bar */}
      <div className="overflow-hidden bg-card border-t border-border text-xs md:text-sm text-muted group">
        <div className="whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] py-2">
          {newsItems.map((item, index) =>
            item.link ? (
              <Link
                key={index}
                href={item.link}
                className="mx-8 hover:text-accent transition-colors"
              >
                {item.text}
              </Link>
            ) : (
              <span key={index} className="mx-8">
                {item.text}
              </span>
            )
          )}
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-surface border-l border-border shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden z-40`}
      >
        <div className="flex flex-col p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-border">
            <span className="text-lg font-semibold">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
