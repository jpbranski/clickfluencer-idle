"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <Head>
        <Link rel="canonical" href="https://www.clickfluenceridle.com/about" />
      </Head>

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
            <span className="font-semibold text-accent">JP the Pirate</span>—blending humor, systems design, and creator culture into something intentionally simple, unexpectedly deep, and pleasantly addictive.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">The Mission</h2>
          <p className="text-lg text-muted leading-relaxed">
            Clickfluencer Idle isn’t just about watching numbers rise—it’s about exploring how we define progress in digital spaces. The game is a small, focused sandbox where attention, pacing, and incentives intersect. It’s satire without cynicism: a playful lens on the creator grind that rewards curiosity, iteration, and the quiet satisfaction of building a system that hums along even when you step away. The goal is to make something approachable for non-gamers and still interesting for players who enjoy optimizing loops and testing strategies.
          </p>
        </div>
      </section>

      {/* Philosophy / Design Ethos */}
      <section className="px-6 py-16 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Built with Curiosity</h3>
            <p className="text-muted leading-relaxed">
              The heart of the project is curiosity—about systems, feedback loops, and the thin line between effort and outcome. Idle games are often treated as light entertainment, but they also surface real design questions: How do you teach pacing? How do you make compounding growth feel fair? How do you create a loop that supports both micro-progress and long-term planning? Clickfluencer Idle is meant to be a small, clear answer to those questions.
            </p>
            <p className="text-muted leading-relaxed mt-4">
              Shipping early and iterating in public keeps the project honest. Rather than chasing endless features, the design favors a stable core: a click economy that’s readable, a prestige that matters, and upgrades that feel consequential. The experience should communicate respect for the player’s time—no predatory timers, no daily chores disguised as rewards, just clean systems and the space to tinker.
            </p>
          </div>

          <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-accent/10 rounded-2xl p-6 border border-border shadow-md">
            <h4 className="font-semibold mb-3 text-accent">Core Pillars</h4>
            <ul className="space-y-2 text-muted">
              <li>Ship over perfect—progress beats paralysis</li>
              <li>Design systems that teach through play</li>
              <li>Favor clarity, legibility, and player agency</li>
              <li>Iterate in public and welcome feedback</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tech Stack – intro */}
      <section className="px-6 py-16 text-center">
        <h3 className="text-2xl font-semibold mb-4 text-foreground">Tech Stack</h3>
        <p className="max-w-2xl mx-auto text-muted mb-8">
          The project uses a modern, developer-friendly stack focused on reliability and straightforward iteration. It’s engineered to be quick to reason about, easy to test, and flexible enough for future content.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {["Next.js 16 (App Router)", "React", "TypeScript", "Tailwind CSS"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-surface text-foreground border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Technical Breakdown – Under the Hood */}
      <section className="px-6 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">Under the Hood</h3>
          <p className="text-muted leading-relaxed">
            The app is structured with the Next.js App Router for predictable routing and layout composition, with React components split into small, testable units and a clear separation between presentation and logic. TypeScript provides the safety net you want in an incremental game—where a single mis-typed number can tilt the economy. Tailwind offers rapid iteration on layout and spacing while keeping style decisions close to the markup, which is useful during polish passes.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            While Tailwind has been a valuable learning experience, it also revealed trade-offs: global utility classes make experimentation fast, but complex components can read noisier than a styled approach. For larger systems or shared design languages, a component library like MUI paired with CSS Modules remains a compelling choice, especially when accessibility primitives and consistent spacing tokens matter at scale. Clickfluencer Idle leans on Tailwind for speed; future work may blend in more structured styling where it improves readability.
          </p>
        </div>
      </section>

      {/* Technical Breakdown – The Balancing Act */}
      <section className="px-6 py-16 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">The Balancing Act</h3>
          <p className="text-muted leading-relaxed">
            Balancing an idle game is more intricate than it looks. Even a “simple” clicker hides compound growth, step-function thresholds, and pacing traps that can make an early game feel flat or a late game feel brittle. Costs and rewards rarely scale linearly: a single multiplier interacts with generator rates, click power, offline earnings, and prestige conversion to produce unexpected curves. The design process here has been iterative—adjusting cost curves, re-ordering upgrade visibility, and tuning prestige thresholds so players feel smart for planning, not punished for exploring.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            The goal is a loop that invites decisions. Buying ten at a time should feel powerful without trivializing the next tier. Infinite upgrades should remain tempting over the long arc without eclipsing themed or situational picks. Prestige must be worth it—but only if you read the moment well. When those tensions resolve cleanly, the game feels fair and alive, even when you’re away from the keyboard.
          </p>
        </div>
      </section>

      {/* Behind the Project */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">Behind the Project</h3>
          <p className="text-muted leading-relaxed">
            Clickfluencer Idle began as a scoped challenge: build a complete, shippable experience in a tight window, with enough polish to stand on its own and enough structure to grow. It’s a portfolio piece, but also a playground for ideas about UX, feedback, and sustainable pacing. Building solo means every decision is visible—architecture, copy, designs that didn’t land, fixes that took one line and fixes that required a rethink. That visibility is part of the point. The project values learning in the open and turning messy iteration into a clean end-product.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            The design aims to respect players’ time. There are no daily chores disguised as generosity, no energy meters masquerading as difficulty. Instead, it’s a transparent economy with readable choices. If something feels off, it’s a balancing problem to solve, not a lever to monetize. That constraint keeps the project honest—and it keeps the conversation with players grounded in design, not tricks.
          </p>
        </div>
      </section>

      {/* Philosophy – Practical Principles */}
      <section className="px-6 py-16 bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Practical Principles</h3>
            <p className="text-muted leading-relaxed">
              The working rules are straightforward: prefer clarity over cleverness; make the first minute delightful and the tenth hour stable; keep data portable so saves feel safe; and ship changes that reduce friction, not add choreography. If a feature makes the game harder to read, it probably doesn’t belong here. If a tweak helps players understand their own progress, it’s worth exploring.
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-accent/10 rounded-2xl p-6 border border-border shadow-md">
            <h4 className="font-semibold mb-3 text-accent">What That Looks Like</h4>
            <ul className="space-y-2 text-muted">
              <li>Clear currency readouts and honest multipliers</li>
              <li>Upgrades that change tempo, not just totals</li>
              <li>Prestige that rewards timing and planning</li>
              <li>Responsive UI with legible defaults and theme polish</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Looking Forward */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">Looking Forward</h3>
          <p className="text-muted leading-relaxed">
            The roadmap is intentionally modest: improve legibility, deepen the prestige layer, and continue tuning the economy as more players explore the edges. The most valuable improvements will likely be quiet ones—better defaults, clearer feedback, smarter ordering of upgrades—paired with occasional content drops that introduce new synergies without overwhelming the core loop. The north star is an experience that feels welcoming on day one and still satisfying on day thirty.
          </p>
          <p className="text-muted leading-relaxed mt-4">
            As the project evolves, the bar remains the same: make something people enjoy, and make it better through real use. If it teaches a few lessons about systems along the way, that’s a success. If it inspires someone to ship their own small, intentional game, that’s even better.
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
