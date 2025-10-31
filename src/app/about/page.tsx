"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200">
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
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            A cozy-chaotic idle game experiment by{" "}
            <span className="font-semibold text-purple-500">JP the Pirate</span>{" "}
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
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Clickfluencer Idle isn't just about clicks — it's about the creative
            grind. Built to explore how we measure progress, attention, and
            success in online spaces, it's a satire, a sandbox, and a systems
            experiment all in one.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-900/60 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Built with Curiosity
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Clickfluencer Idle is an experiment in shared creativity — a space
              where players, builders, and curious minds can laugh at the grind,
              explore systems, and find joy in progress together. It's a playful
              reminder that learning and community can be just as rewarding as
              any leaderboard.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md">
            <h4 className="font-semibold mb-3 text-purple-500">Core Pillars</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
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
        <h3 className="text-2xl font-semibold mb-4">Tech Stack</h3>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 mb-8">
          Built using a modern, performant stack focused on developer experience
          and scalability.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Behind the Project */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4">Behind the Project</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Clickfluencer Idle is part of a larger 3-year career roadmap — a
            series of projects designed to blend creativity, systems thinking,
            and entrepreneurship. Each release builds toward a portfolio of real
            users, real revenue, and real learning.
          </p>
        </div>
      </section>

      {/* Professional Links */}
      <section className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-500">
        <div className="flex justify-center flex-wrap gap-4">
          <Link
            href="https://jpbranski.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:underline"
          >
            jpbranski.com
          </Link>
          <span>•</span>
          <Link
            href="https://github.com/jpbranski"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:underline"
          >
            GitHub
          </Link>
          <span>•</span>
          <Link
            href="https://linkedin.com/in/jonathanbranski"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:underline"
          >
            LinkedIn
          </Link>
        </div>
      </section>
    </main>
  );
}
