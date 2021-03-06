import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import firebase from "../firebase";

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firebase),
  theme: "dark",
  secret: process.env.NEXTAUTH_SECRET,
});
