import User from "@models/user";
import { connectToDB } from "@utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        // Ensure the DB connection is established
        await connectToDB();

        // Find the user in the database
        const sessionUser = await User.findOne({ email: session.user.email });

        // If user is found, attach their id to the session
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      } catch (error) {
        console.error("Error fetching session user:", error);
        return session; // Return the session even if there is an error
      }
    },

    async signIn({ profile }) {
      try {
        // Ensure the DB connection is established
        await connectToDB();

        // Check if the user exists
        const userExists = await User.findOne({ email: profile.email });

        // If user doesn't exist, create a new user
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(), // removes spaces
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
