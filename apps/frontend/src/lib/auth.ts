import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface User {
    id?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
         
          const backendUrl = "http://127.0.0.1:3001"; 
          const googleId = user.id || account.providerAccountId;

          const res = await fetch(`${backendUrl}/auth/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.image,
              googleId: googleId,
            }),
          });

          if (!res.ok) {

            console.error("⚠️ Backend Sync Failed (Login Allowed):", await res.text());
            return true; 
          }
          return true;
        } catch (error) {
          console.error("⚠️ Auth Sync Network Error (Login Allowed):", error);
          return true; // ALLOW LOGIN even if backend is down
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});