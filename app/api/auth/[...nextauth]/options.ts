// app/api/auth/[...nextauth]/options.ts

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

// This is the NextAuth config object.
// It is responsible for setting up the authentication flow.
export const authOptions: NextAuthOptions = {
  // Providers are the authentication providers that are used to authenticate users.
  // In this case, we are using the Credentials provider.
  // The Credentials provider will handle the login form.
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // This function is called when the user logs in.
      // It is responsible for authorizing the user.
      // The function takes one argument, the credentials.
      // The credentials are the email and password that the user entered.
      // The function should return the user object from the database.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
        };
      }
    })
  ],
  // Callbacks are functions that are called at different points in the authentication flow.
  // - jwt: This function is called when the user logs in.
  //   It is responsible for generating a JWT token that will be stored in the user's cookies.
  //   The function takes two arguments, the token and the user.
  //   The token is the JWT token that will be generated.
  //   The user is the user object from the database.
  //   The function should return the token.
  // - session: This function is called when the user logs in.
  //   It is responsible for generating the session object.
  //   The function takes two arguments, the session and the token.
  //   The session is the session object that will be stored in the user's cookies.
  //   The token is the JWT token that was generated in the jwt callback.
  //   The function should return the session.
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  // Pages are the pages that are used in the authentication flow.
  // - signIn: The login page.
  // - error: The error page.
  pages: {
    signIn: "/login",
    error: "/login"
  },
  // Session is the session config.
  // - strategy: The strategy for the session.
  //   In this case, we are using the JWT strategy.
  // - maxAge: The maximum age of the session in seconds.
  //   In this case, we are setting it to 1 day.
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1 day
  },
  // Secret is the secret key for the session.
  // This is a random string that is used to sign the JWT token.
  secret: process.env.NEXTAUTH_SECRET,
};

