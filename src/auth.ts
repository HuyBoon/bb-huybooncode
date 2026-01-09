import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import connectDB from "@/libs/db";
import User from "@/models/User";
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

                    const user = await User.findOne({ email }).select(
                        "+password"
                    );

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (!passwordsMatch) return null;

                    if (user.isActive === false) {
                        throw new Error("ACCOUNT_LOCKED");
                    }

                    try {
                        await User.findByIdAndUpdate(user._id, {
                            lastLogin: new Date(),
                        });
                    } catch (error) {
                        console.error("Update lastLogin failed", error);
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        image: user.image,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user.role as string) || "user";
                token.image = user.image;
                token.id = user.id as string;
            }

            if (trigger === "update" && session) {
                token.image = session.user.image;
                token.name = session.user.name;
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
});
