# 🎮 Clickfluencer Idle

> Build your social media empire from a single click to becoming the ultimate digital influencer

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An incremental idle game where you climb the ladder of social media fame through strategic clicking, automated content creation, and smart upgrades. Experience the cozy-chaotic journey from zero to influencer extraordinaire!

## ✨ Features

### 🎯 Core Gameplay
- **Manual Clicking** - Click to create posts and earn followers
- **6 Content Generators** - Automate follower generation with Photo Posts, Videos, Livestreams, Collaborations, Brand Deals, and Talent Agencies
- **Multi-Tier Upgrades** - Improve click power, production rates, and unlock special bonuses
- **Prestige System** - Reset for permanent reputation bonuses
- **Random Events** - Experience viral posts, trending topics, celebrity mentions, and more
- **10 Unlockable Themes** - Customize your interface with unique visual styles
- **Achievement System** - Track milestones and accomplishments
- **Offline Progress** - Earn followers even when you're away (up to 72 hours)

### 💾 Technical Features
- **Advanced Storage System** - IndexedDB with localStorage fallback, automatic backups, and corruption detection
- **Performance Optimized** - React.memo, number formatting cache, and efficient game loop
- **Fully Responsive** - Seamless experience on desktop, tablet, and mobile
- **Dark Mode Support** - Multiple theme options with system preference detection
- **PWA Ready** - Infrastructure for Progressive Web App (configurable)
- **Production Ready** - Optimized builds, code splitting, and compression

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17.0 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/clickfluencer-idle.git
cd clickfluencer-idle

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start

# Build and generate sitemap
npm run build && npm run postbuild
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint code analysis |
| `npm run format` | Auto-format code with Prettier |
| `npm run format:check` | Check code formatting without changes |
| `npm run test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run type-check` | Run TypeScript type validation |
| `npm run export-economy` | Export game balance data to CSV |

## 🏗️ Project Structure

```
clickfluencer-idle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Main game page
│   │   ├── layout.tsx          # Root layout
│   │   ├── about/              # About page
│   │   ├── guide/              # Game guide
│   │   ├── achievements/       # Achievements showcase
│   │   └── [other routes]/     # Additional pages
│   │
│   ├── components/             # React components (56 files)
│   │   ├── layout/             # Layout components (GameShell, SidebarColumn, BottomNav)
│   │   ├── panels/             # Game panels (Generators, Upgrades, Themes, Achievements)
│   │   ├── PostButton.tsx      # Main clicker button
│   │   ├── CurrencyBar.tsx     # Currency display
│   │   ├── GeneratorCard.tsx   # Content generator card
│   │   ├── UpgradeCard.tsx     # Upgrade card
│   │   └── [others]            # Event toasts, modals, settings, etc.
│   │
│   ├── game/                   # Game engine & logic
│   │   ├── state.ts            # Game state definitions & selectors
│   │   ├── engine.ts           # Main game loop, events, offline progress
│   │   ├── actions.ts          # User actions (click, buy, prestige)
│   │   ├── balance.ts          # Game balance constants
│   │   ├── format.ts           # Number formatting utilities
│   │   ├── prestige.ts         # Prestige system calculations
│   │   ├── generators/         # Generator definitions
│   │   ├── upgrades/           # Upgrade definitions
│   │   └── logic/              # Game calculation logic
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGame.tsx         # Main game state management hook
│   │   └── useThemeManager.tsx # Theme switching hook
│   │
│   ├── lib/                    # Utilities & helpers
│   │   ├── storage/            # Storage system (IndexedDB + localStorage)
│   │   │   ├── storage.ts      # Advanced storage orchestrator
│   │   │   ├── indexedDb.ts    # IndexedDB driver
│   │   │   └── localStorage.ts # LocalStorage driver
│   │   ├── crypto/             # Hash utilities for data integrity
│   │   ├── time/               # Time & interval utilities
│   │   └── logger.ts           # Logging system
│   │
│   ├── data/                   # Game content data
│   │   ├── themes.ts           # Theme definitions
│   │   ├── notoriety.ts        # Notoriety system (future feature)
│   │   ├── news.json           # News feed entries
│   │   └── changelog.json      # Version history
│   │
│   ├── config/                 # Configuration
│   │   └── game.ts             # Game balance & content definitions
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── theme.ts            # Theme interface
│   │
│   ├── app-config.ts           # Feature flags & app configuration
│   └── styles/                 # Additional styles
│       ├── globals.css         # Global styles & Tailwind imports
│       └── themes.css          # Theme color variables
│
├── public/                     # Static assets
│   ├── robots.txt              # SEO robots directive
│   ├── sitemap.xml             # SEO sitemap (generated)
│   └── ads.txt                 # AdSense configuration
│
├── tests/                      # Test files (Vitest)
│
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.mjs             # Next.js configuration
├── next-sitemap.config.js      # Sitemap generator configuration
└── package.json                # Project dependencies & scripts
```

## 🎮 Game Mechanics

### Currency System

| Currency | How to Earn | Uses |
|----------|-------------|------|
| **Followers** (Creds) | Manual clicks + generators | Buy generators and upgrades |
| **Shards** (Awards) | 0.3% drop rate on clicks | Purchase premium themes |
| **Reputation** | Prestige resets | Permanent +10% production per point |
| **Notoriety** | Special generators (future) | Notoriety-exclusive upgrades |

### Content Generators

1. **📸 Photo Post** - 0.1 followers/sec, cost multiplier ×1.15
2. **🎥 Video Content** - 1.0 followers/sec, cost multiplier ×1.14
3. **📹 Live Stream** - 8.0 followers/sec, cost multiplier ×1.13
4. **🤝 Collaboration** - 47 followers/sec, cost multiplier ×1.12
5. **💼 Brand Deal** - 260 followers/sec, cost multiplier ×1.11
6. **🏢 Talent Agency** - 1,500 followers/sec, cost multiplier ×1.10

### Upgrade Categories

- **Click Power** - Better Camera (7 tiers), AI Enhancements (infinite), Better Filters (infinite)
- **Production** - Generator-specific multipliers, global production boosts
- **Special** - Lucky Charm (award drop rate), Overnight Success (offline efficiency), Cred Cache (bonus clicks)

### Random Events

Temporary multiplier events with 5% chance every 30 seconds:
- 🔥 Viral Post (3x followers, 60s)
- 📈 Trending Topic (2x generators, 120s)
- ⭐ Celebrity Mention (5x clicks, 30s)
- 🚀 Algorithm Boost (2x followers, 90s)
- 💰 Sponsored Post (4x followers, 45s)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy template from src/data/env.txt
cp src/data/env.txt .env.local

# Edit .env.local with your values
# Then delete env.txt for security
```

Key environment variables:
- `NEXT_PUBLIC_ADSENSE_ID` - Google AdSense publisher ID
- `NEXT_PUBLIC_GA_ID` - Google Analytics measurement ID
- `NEXT_PUBLIC_API_URL` - API base URL (future use)

### Feature Flags

Edit `src/app-config.ts` to enable/disable features:

```typescript
export const FEATURES = {
  enablePWA: false,              // Progressive Web App
  enableAds: false,              // Google AdSense
  enableAnalytics: false,        // Google Analytics
  enableAchievements: true,      // Achievement system
  enableLeaderboards: false,     // Future feature
  enableDebugMenu: isDev,        // Debug tools (dev only)
};
```

## 🎨 Customization

### Adding New Themes

Edit `src/data/themes.ts`:

```typescript
{
  id: "your-theme",
  name: "Your Theme",
  cost: 100,                      // Shards cost
  unlocked: false,
  active: false,
  bonusMultiplier: 1.15,         // +15% production
  bonusClickPower: 5,            // +5 click power (optional)
  // Define CSS variables in src/styles/themes.css
}
```

### Modifying Game Balance

Edit `src/game/balance.ts` to adjust:
- Generator costs and production rates
- Upgrade costs and effects
- Prestige thresholds and bonuses
- Event frequencies and multipliers

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Other Platforms

The game is a static Next.js app and can be deployed to:
- Netlify
- GitHub Pages
- CloudFlare Pages
- Any static hosting service

Build command: `npm run build`
Output directory: `.next`

## 📊 Performance Optimizations

### Implemented Optimizations

✅ **React Performance**
- React.memo on all card components with custom equality checks
- useMemo for computed values in hooks
- Component lazy loading for routes

✅ **Number Formatting**
- LRU cache (1000 entries) for frequently formatted numbers
- Reduces redundant calculations by ~70-90%

✅ **Storage System**
- IndexedDB with localStorage fallback
- 3-level backup system
- SHA-256 checksum verification
- Corruption detection and recovery

✅ **Build Optimizations**
- Console.log removal in production
- CSS optimization
- Image optimization (AVIF/WebP)
- Tree-shaking for heavy dependencies (Framer Motion)

✅ **Game Engine**
- 250ms tick interval (4 ticks/second)
- Event-driven architecture
- Efficient pub/sub system

### Performance Metrics

Expected improvements from optimizations:
- Initial load time: -15-25%
- Re-render frequency: -70-90%
- Bundle size: -10-20%
- Memory usage: -10-15%

## 🛠️ Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Write meaningful commit messages (Conventional Commits)
- Add JSDoc comments for complex functions
- Use functional components with hooks

### Component Guidelines

- Keep components small and focused (< 200 lines)
- Use TypeScript interfaces for all props
- Memoize expensive components with React.memo
- Handle loading and error states
- Use semantic HTML and ARIA labels

### State Management

- Game state managed through useGame hook
- Actions are pure functions
- Selectors for derived values
- No direct state mutations

### Commit Messages

Follow Conventional Commits:
```
feat: add new content generator
fix: resolve offline progress calculation bug
docs: update README with deployment instructions
style: format code with Prettier
refactor: optimize number formatting cache
perf: reduce re-renders with React.memo
test: add tests for prestige system
```

## 🐛 Troubleshooting

### Common Issues

**Game not saving progress**
- Check browser console for IndexedDB errors
- Clear browser storage and reload
- Ensure third-party cookies are enabled

**Offline progress not working**
- Verify `offlineProgressEnabled` setting in game
- Check that browser wasn't in incognito mode
- Offline progress capped at 72 hours

**Theme not applying**
- Clear browser cache
- Check localStorage for `active-theme` key
- Verify CSS variables are defined in `src/styles/themes.css`

**Build errors**
- Run `npm run type-check` to find TypeScript errors
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall dependencies

## 📝 Changelog

See [CHANGELOG.md](src/data/changelog.json) for version history and updates.

## 🤝 Contributing

While this is primarily a personal project, contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code passes all tests (`npm test`)
- Code is properly formatted (`npm run format`)
- No linting errors (`npm run lint`)
- Type checking passes (`npm run type-check`)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic incremental games like Cookie Clicker and Adventure Capitalist
- Built with modern web technologies: Next.js, React, TypeScript, and Tailwind CSS
- Special thanks to the incremental games community

## 📬 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/clickfluencer-idle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/clickfluencer-idle/discussions)

## 🌟 Show Your Support

If you enjoy this project, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔀 Contributing code

---

**Made with ☕ and 💙 by the Clickfluencer team**

*Happy clicking!* 🎮
