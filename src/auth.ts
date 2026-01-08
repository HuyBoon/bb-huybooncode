import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import connectDB from "@/libs/db";
import User from "./models/User";
import bcrypt from "bcryptjs";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = LoginSchema.safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;

                    await connectDB();
                    const user = await User.findOne({ email });

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) {
                        if (
                            user.role !== "admin" &&
                            user.role !== "superAdmin"
                        ) {
                            throw new Error("FORBIDDEN_ACCESS");
                        }

                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            image: user.image,
                        };
                    }
                }
                console.log("Invalid credentials");
                return null;
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
                token.image = user.image;
            }

            if (trigger === "update" && session) {
                token.image = session.user.image;
                token.name = session.user.name;
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
});
