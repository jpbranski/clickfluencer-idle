import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
    // Note: Steam provider requires additional setup with openid-client
    // Uncomment and configure when ready:
    // {
    //   id: "steam",
    //   name: "Steam",
    //   type: "oauth",
    //   wellKnown: "https://steamcommunity.com/openid",
    //   authorization: { params: { scope: "" } },
    //   idToken: true,
    //   checks: ["none"],
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.personaname,
    //       image: profile.avatarfull,
    //     };
    //   },
    // },
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
