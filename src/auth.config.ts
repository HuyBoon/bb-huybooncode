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
        // 1. Map role vào token (Chạy khi login hoặc check session)
        async jwt({ token, user }) {
            if (user) {
                token.role = (user.role as string) || "user";
                token.id = user.id as string;
            }
            return token;
        },

        // 2. Map role từ token sang session (Để middleware đọc được)
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

            console.log("MIDDLEWARE CHECK:", {
                path,
                email: auth?.user?.email,
                role: role,
                isLoggedIn,
            });
            // -----------------

            const isAdminRoute = path.startsWith("/admin");
            const isAuthRoute =
                path.startsWith("/auth") ||
                path === "/login" ||
                path === "/register";

            if (isAdminRoute) {
                if (!isLoggedIn) return false;

                // Nếu role không đúng -> Đá về trang chủ
                if (role !== "admin" && role !== "superAdmin") {
                    return Response.redirect(new URL("/unauthorized", nextUrl));
                }
                return true;
            }

            if (isAuthRoute && isLoggedIn) {
                if (role === "admin" || role === "superAdmin") {
                    return Response.redirect(new URL("/admin", nextUrl));
                }
                return Response.redirect(new URL("/", nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
