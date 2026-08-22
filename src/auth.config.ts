import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the Auth.js config (no Prisma/bcrypt providers), used
 * directly by middleware so the DB client never needs to run there.
 */
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
