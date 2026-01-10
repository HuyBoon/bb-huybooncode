import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user.role as string) || "user";
                token.id = user.id as string;
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },

        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = auth?.user?.role;
            const path = nextUrl.pathname;

            const isAdminRoute = path.startsWith("/admin");
            const isAuthRoute =
                path === "/login" ||
                path === "/register" ||
                path.startsWith("/auth");
            const isUserDashboard = path.startsWith("/dashboard");

            if (isAdminRoute) {
                if (!isLoggedIn) {
                    const loginUrl = nextUrl.clone();
                    loginUrl.pathname = "/login";
                    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
                    return Response.redirect(loginUrl);
                }

                if (role !== "admin" && role !== "superAdmin") {
                    const unauthorizedUrl = nextUrl.clone();
                    unauthorizedUrl.pathname = "/unauthorized";
                    return Response.redirect(unauthorizedUrl);
                }
                return true;
            }

            if (isAuthRoute && isLoggedIn) {
                const redirectUrl = nextUrl.clone();

                if (role === "admin" || role === "superAdmin") {
                    redirectUrl.pathname = "/admin";
                } else {
                    redirectUrl.pathname = "/dashboard";
                }
                return Response.redirect(redirectUrl);
            }

            if (isUserDashboard && !isLoggedIn) {
                const loginUrl = nextUrl.clone();
                loginUrl.pathname = "/login";
                return Response.redirect(loginUrl);
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
