import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            role?: string;
            image?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        role?: string;
        image?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        image?: string | null;
    }
}
