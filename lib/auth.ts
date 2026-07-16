import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db.connect";
import User from "@/models/authentication/user";


export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email aur password dono chahiye, khaali mat chhod");
        }

        await dbConnect();

        const user = await User.findByEmailWithPassword(credentials.email);

        if (!user) {
          throw new Error("Yeh email registered nahi hai");
        }

        if (!user.emailVerified) {
          throw new Error("Pehle apna email verify kar, link bheja tha register ke waqt");
        }

        if (user.status === "pending") {
          throw new Error("Tera account abhi approve nahi hua hai, manager se baat kar");
        }

        if (user.status === "removed" || user.status === "deleted") {
          throw new Error("Tera account active nahi hai, admin se contact kar");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          user.addLog("login_failed", null, "Wrong password attempt");
          await user.save();
          throw new Error("Password galat hai");
        }

        user.addLog("login", user._id as any, null);
        await user.save();

        return {
          id: (user._id as any).toString(),
          name: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};