# Setup Guide for Clickfluencer Idle v0.2.0

This guide will help you set up authentication and cloud saving for Clickfluencer Idle.

## Prerequisites

- Node.js 18.17.0 or later
- A Vercel account (for Nova PostgreSQL database)
- OAuth credentials from Google, Discord, and/or Steam

---

## 1. Database Setup (Vercel Nova PostgreSQL)

### Create a PostgreSQL Database on Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the Storage tab
3. Click "Create Database" → Select "Postgres" (Neon backend via Nova)
4. Follow the prompts to create your database
5. Copy the connection string (it should look like `postgresql://user:password@host:5432/database`)

### Configure Environment Variables

1. Copy `.env.local.example` to `.env.local` (or edit the existing `.env.local`)
2. Add your database connection string:

```env
DATABASE_URL="your-vercel-postgres-connection-string"
```

### Push the Prisma Schema

Run the following commands to set up your database:

```bash
npx prisma db push
npx prisma generate
```

This will:
- Create all necessary tables in your PostgreSQL database
- Generate the Prisma client for TypeScript

---

## 2. NextAuth Configuration

### Generate a Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Add it to your `.env.local`:

```env
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

For production, update `NEXTAUTH_URL` to your production domain.

---

## 3. OAuth Provider Setup

You need to set up at least one OAuth provider (Google, Discord, or Steam).

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy your Client ID and Client Secret

Add to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "OAuth2" → Add redirect: `http://localhost:3000/api/auth/callback/discord`
4. Copy your Client ID and Client Secret

Add to `.env.local`:

```env
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### Steam OAuth (Optional)

1. Go to [Steam Community](https://steamcommunity.com/dev/apikey)
2. Register for a Steam Web API Key
3. Copy your API key

Add to `.env.local`:

```env
STEAM_API_KEY="your-steam-api-key"
```

**Note:** Steam OAuth requires additional configuration in `/src/app/api/auth/[...nextauth]/route.ts`. Uncomment and configure the Steam provider section when ready.

---

## 4. Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

For production deployment:

1. Add all environment variables to your Vercel project settings
2. Update `NEXTAUTH_URL` to your production domain
3. Update OAuth redirect URIs in each provider's settings
4. Deploy via Vercel:

```bash
vercel --prod
```

---

## 5. Features

### Cloud Saving

- **Local saves:** Every 30 seconds to localStorage
- **Cloud saves:** Every 5 minutes, or immediately when:
  - Buying an upgrade
  - Prestiging
  - Closing the browser tab

### Authentication

- Sign in with Google, Discord, or Steam
- User profile displayed in header
- Saves automatically sync to the cloud when logged in

---

## Troubleshooting

### Prisma Issues

If you encounter Prisma engine download issues:

```bash
# Set environment variable to ignore checksum errors
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Database Connection Errors

- Verify your `DATABASE_URL` is correct
- Ensure your IP is whitelisted in Vercel (if required)
- Check that the database exists and is accessible

### OAuth Errors

- Ensure redirect URIs match exactly (including http/https)
- Verify client IDs and secrets are correct
- Check that the OAuth provider is enabled

---

## New Pages

This update includes new pages:

- **/news** - Game updates and changelog
- **/guide** - How to play guide
- **/accessibility** - Accessibility information
- **/contact** - Contact information

All pages are fully themed and responsive!

---

## Support

For issues or questions:

- Email: [dev@jpbranski.com](mailto:dev@jpbranski.com)
- GitHub Issues: [clickfluencer-idle/issues](https://github.com/jpbranski/clickfluencer-idle/issues)
