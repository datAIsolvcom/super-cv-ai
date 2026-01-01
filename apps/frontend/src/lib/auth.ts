import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: "select_account" } },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const backendUrl = "http://127.0.0.1:3001"; 
        try {
          const res = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const user = await res.json();
          if (res.ok && user) return user;
          return null;
        } catch (error) { return null; }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id; // Default ID
        
    
        if (account?.provider === "google") {
          try {
             const backendUrl = "http://127.0.0.1:3001";
             const res = await fetch(`${backendUrl}/auth/sync`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                 email: user.email,
                 name: user.name,
                 picture: user.image,
               }),
             });
             if (res.ok) {
               const dbUser = await res.json();
               token.id = dbUser.id; 
               token.credits = dbUser.credits;
             }
          } catch (e) { console.error("Sync failed", e); }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" }, 
});