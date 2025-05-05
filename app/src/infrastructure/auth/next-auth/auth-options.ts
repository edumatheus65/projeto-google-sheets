import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // callbacks: {
  //    async jwt({ token}) {
  //     return token;
  //    },
  //    async session({ session}) {
  //     if (session.user) {
  //         session.user as any).avatarUrl = session.user.image
  //     }
  //     return session
  //    }
  // },
  // pages: {
  //     signIn: '/login',
  //     error: '/auth/error',
  // }
};
