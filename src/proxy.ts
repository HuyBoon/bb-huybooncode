// src/middleware.ts
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { authConfig } from "./auth.config";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isApiOrStatic =
        nextUrl.pathname.startsWith("/api") ||
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.startsWith("/_vercel") ||
        /\.(.*)$/.test(nextUrl.pathname);

    if (isApiOrStatic) return;

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/register" ||
        nextUrl.pathname.startsWith("/auth");

    if (isAdminRoute || isAuthRoute) {
        return;
    }

    // Các trang còn lại (Home, Blog...) thì chạy đa ngôn ngữ
    return intlMiddleware(req);
});

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
