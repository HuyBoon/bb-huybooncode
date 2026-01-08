import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.role && session.user) {
                session.user.role = token.role;
            }
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnLogin = nextUrl.pathname.startsWith("/admin/login");
            const role = auth?.user?.role;

            if (isOnAdmin && !isOnLogin) {
                if (!isLoggedIn) return false;
                if (role !== "admin" && role !== "superAdmin") {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            if (isOnLogin && isLoggedIn) {
                if (role === "admin" || role === "superAdmin") {
                    return Response.redirect(new URL("/admin", nextUrl));
                }

                return true;
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
