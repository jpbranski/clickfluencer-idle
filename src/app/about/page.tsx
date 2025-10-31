"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* Navigation */}
      <nav className="border-b border-border mb-8 px-4 py-3 flex justify-center gap-6 text-sm flex-wrap">
        <Link href="/" className="text-accent hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/acknowledgements" className="hover:underline">Acknowledgements</Link>
        <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
      </nav>

      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 px-6">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            About Clickfluencer Idle
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted">
            A cozy-chaotic idle game experiment by{" "}
            <span className="font-semibold text-accent">JP the Pirate</span>{" "}
            — blending humor, systems design, and creator culture into something
            weirdly addictive.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            The Mission
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Clickfluencer Idle isn't just about clicks — it's about the creative
            grind. Built to explore how we measure progress, attention, and
            success in online spaces, it's a satire, a sandbox, and a systems
            experiment all in one.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-16 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">
              Built with Curiosity
            </h3>
            <p className="text-muted leading-relaxed">
              Clickfluencer Idle is an experiment in shared creativity — a space
              where players, builders, and curious minds can laugh at the grind,
              explore systems, and find joy in progress together. It's a playful
              reminder that learning and community can be just as rewarding as
              any leaderboard.
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-accent/10 rounded-2xl p-6 border border-border shadow-md">
            <h4 className="font-semibold mb-3 text-accent">Core Pillars</h4>
            <ul className="space-y-2 text-muted">
              <li>🚀 Ship &gt; Perfect — build, learn, iterate</li>
              <li>🧠 Learn through systems, not tutorials</li>
              <li>🤝 Build things real people use</li>
              <li>💬 Share your process publicly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-foreground">Tech Stack</h3>
        <p className="max-w-2xl mx-auto text-muted mb-8">
          Built using a modern, performant stack focused on developer experience
          and scalability.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-surface text-foreground border border-border"
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Behind the Project */}
      <section className="px-6 py-16 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">Behind the Project</h3>
          <p className="text-muted leading-relaxed">
            Clickfluencer Idle is part of a larger 3-year career roadmap — a
            series of projects designed to blend creativity, systems thinking,
            and entrepreneurship. Each release builds toward a portfolio of real
            users, real revenue, and real learning.
          </p>
        </div>
      </section>

      {/* Professional Links */}
      <section className="px-6 py-12 text-center text-sm text-muted">
        <div className="flex justify-center flex-wrap gap-4">
          <Link
            href="https://jpbranski.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            jpbranski.com
          </Link>
          <span>•</span>
          <Link
            href="https://github.com/jpbranski"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </Link>
          <span>•</span>
          <Link
            href="https://linkedin.com/in/jonathanbranski"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            LinkedIn
          </Link>
        </div>
      </section>
    </main>
  );
}
