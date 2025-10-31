'use client';

import type { Metadata } from 'next';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'Acknowledgements - Clickfluencer Idle',
  description:
    'Special thanks to the friends, family, and feline assistants who helped shape Clickfluencer Idle. A celebration of support, laughter, and shared creativity.',
  openGraph: {
    type: 'article',
    title: 'Acknowledgements - Clickfluencer Idle',
    description:
      'Special thanks to the friends, family, and feline assistants who helped shape Clickfluencer Idle.',
    url: '/acknowledgements',
    siteName: 'Clickfluencer Idle',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clickfluencer Idle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acknowledgements - Clickfluencer Idle',
    description:
      'Special thanks to the friends, family, and feline assistants who helped shape Clickfluencer Idle.',
    images: ['/og-image.png'],
  },
};

export default function AcknowledgementsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-20 text-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 px-6">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Acknowledgements
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            No project is ever truly built alone. Behind every click, commit, and
            caffeine-fueled all-nighter are the people—and occasional pets—who
            shape, test, and encourage it into being.
          </p>
        </div>
      </section>

      {/* Thanks Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md text-left">
            <p className="text-lg mb-4">
              <strong>My good friends Jakob and Midnight</strong>—for always
              being ready to test out my many creations. Whether it's a new game
              mechanic, an interface idea, or an overly ambitious late-night
              prototype, they never hesitate to jump in, break things, and
              provide feedback that somehow balances humor and honesty in equal
              measure. Their willingness to dive into half-finished builds and
              still find something fun in them reminds me why I build in the
              first place—for curiosity, for laughter, and for the joy of
              seeing something come alive on screen.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md text-left">
            <p className="text-lg mb-4">
              <strong>Another good friend Stephen</strong>—for his uncanny
              ability to find new and unexpected ways to break everything I
              make. Every developer needs a chaos tester, and Stephen wears that
              title proudly. Where others might quietly report a bug, he sends a
              screenshot, a crash log, and a full essay explaining how he turned
              my perfectly reasonable code into an existential crisis. His gift
              for destructive discovery has made every system sturdier—even if
              my sanity occasionally takes the hit.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md text-left">
            <p className="text-lg mb-4">
              <strong>My wife</strong>—for her patience, her creativity, and her
              relentless encouragement to keep pushing forward. She reminds me
              that every new project, no matter how daunting or strange, is an
              opportunity to learn and grow. She's the voice that says 'try
              again' when I'm tempted to shelve an idea, and the reason I aim
              higher with every iteration. This game, like so many of my
              projects, exists in no small part because she believes in my
              ability to finish what I start—and to dream bigger than I often
              allow myself to.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-md text-left">
            <p className="text-lg mb-4">
              <strong>My cats</strong>—for their tireless contributions to the
              creative process. They've added keystrokes, closed editors,
              deleted files, and generally made sure that no code session goes
              un-supervised. Their dedication to sitting directly on the
              keyboard is unmatched. Every misplaced semicolon, unexpected
              indent, and mysterious 'aaaaaaaaaa' string in the commit history
              is a small reminder that even the smallest paws can leave a mark
              on development. Truly, they are the unsung QA engineers of this
              household.
            </p>
          </div>

          {/* Wrap-up Paragraph */}
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
            Projects like <em>Clickfluencer Idle</em> don't exist in isolation.
            They grow from community, encouragement, and the shared spark of
            people who care—whether that means offering a late-night idea,
            testing a new build, or just asking 'How's the game coming?'
            These acknowledgements may only list a handful of names, but they
            stand for a much larger circle of support: friends, family,
            creators, and players who make every click and commit feel
            worthwhile. So to everyone who's been part of this journey,
            intentionally or accidentally—thank you. And to the cats: please
            stop renaming my variables while I'm not looking.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
            (Total number of bugs introduced by humans: 37. By cats: still
            counting.)
          </p>
        </div>
      </section>
    </main>
  );
}
