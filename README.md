# Clickfluencer Idle

An incremental idle game where you build your social media empire from a single click to becoming the ultimate digital influencer.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** IndexedDB (via idb)
- **Testing:** Vitest + React Testing Library
- **Code Quality:** ESLint + Prettier

## Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the game.

### Building for Production

```bash
# Create an optimized production build
npm run build
# or
yarn build
# or
pnpm build

# Start the production server
npm run start
# or
yarn start
# or
pnpm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with Vitest UI
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
clickfluencer-idle/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions and helpers
│   ├── types/           # TypeScript type definitions
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
├── tests/               # Test files
└── [config files]       # Configuration files
```

## Game Features (Planned)

- Click-based follower generation
- Automated content generation systems
- Multiple social media platforms
- Upgrade trees and prestige systems
- Offline progress
- Achievement system
- Statistics and analytics

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the project's ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Component Structure

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement proper error boundaries

## Performance

The game uses:
- IndexedDB for persistent local storage
- React 19 for optimal rendering
- Next.js App Router for code splitting
- Tailwind CSS for minimal CSS bundle size

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome)

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - feel free to use this code for your own projects.

## Acknowledgments

Built with ☕ and inspired by classic incremental games like Cookie Clicker and Adventure Capitalist.