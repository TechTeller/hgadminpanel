import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db/client";
import { env } from "@/env/server.mjs";

import { BOT_API_URL, jsonFetch } from "@/utils/trpc";
import { DiscordType } from "@prisma/client";

const scopes = ["identify", "guilds", "guilds.members.read"].join(" ");

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({ account }) {
      let isAllowedToSignIn = false;
      try {
        // check if user is valid
        const dbUsers = await prisma.discordRole.findMany({
          where: { type: DiscordType.USER },
          select: { snowflake: true },
        });
        for (let user of dbUsers) {
          if (user.snowflake === account?.providerAccountId)
            isAllowedToSignIn = true;
        }
        if (isAllowedToSignIn) {
          return isAllowedToSignIn;
        }

        // check if user has valid roles
        const dbRoles = await prisma.discordRole.findMany({
          where: { type: DiscordType.ROLE },
          select: { snowflake: true },
        });
        const data = await jsonFetch(
          `${BOT_API_URL}/verify/${account?.providerAccountId}`,
          "GET"
        );
        const dataRoles = data?.roles ?? [];
        for (let role of dbRoles) {
          if (dataRoles.includes(role.snowflake)) {
            isAllowedToSignIn = true;
          }
        }
      } catch (err) {
        console.log(err);
      }
      return isAllowedToSignIn;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: scopes } },
      checks: "state",
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
