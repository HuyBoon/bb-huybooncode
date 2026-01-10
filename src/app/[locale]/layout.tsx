import "@/app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/libs/getMessages";
import { routing } from "@/i18n/routing";

import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { auth } from "@/auth";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-sans",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin", "vietnamese"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        template: "%s | HuyBoon - Frontend Developer",
        default: "HuyBoon | Frontend Developer & Web Creator",
    },
    description:
        "HuyBoon - Frontend Developer đam mê tạo ra các website đẹp, nhanh và thân thiện với người dùng. Chuyên Next.js, React, TypeScript, TailwindCSS, Landing Page & Web App hiện đại, tối ưu SEO.",

    keywords: [
        "HuyBoon",
        "Frontend Developer",
        "React Developer",
        "Next.js Developer",
        "Thiết kế website",
        "Landing page",
        "Web App",
        "TypeScript",
        "TailwindCSS",
        "Developer Việt Nam",
    ],

    openGraph: {
        title: "HuyBoon | Frontend Developer",
        description:
            "Tạo ra những website đẹp mắt, nhanh, chuẩn SEO và mang lại trải nghiệm người dùng tuyệt vời.",
        url: "https://huyboon.tech",
        siteName: "HuyBoon",
        images: [
            {
                url: "/og-image.png", // nên thay bằng ảnh cá nhân hoặc dự án đẹp của bạn
                width: 1200,
                height: 630,
                alt: "HuyBoon - Frontend Developer Portfolio",
            },
        ],
        locale: "vi_VN",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "HuyBoon | Frontend Developer",
        description:
            "Xây dựng website hiện đại với Next.js • React • TypeScript",
        images: ["/og-image.png"],
        creator: "@Huy74", // nếu bạn có twitter/X thì thêm vào, nếu không thì bỏ dòng này
    },

    // Optional: thêm nếu muốn
    alternates: {
        canonical: "https://huyboon.tech",
    },
};

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const session = await auth();
    const supportedLocales: readonly ["vi", "en"] = routing.locales;
    const localeRaw = supportedLocales.includes(locale as "vi" | "en")
        ? (locale as "vi" | "en")
        : "en";

    if (!supportedLocales.includes(localeRaw)) {
        notFound();
    }

    let messages;
    try {
        messages = await getMessages(localeRaw);
    } catch (error) {
        console.error("Error loading messages:", error);
        notFound();
    }

    return (
        <html lang={localeRaw} suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <NextIntlClientProvider locale={localeRaw} messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main>{children}</main>

                        <Toaster
                            position="top-right"
                            theme="system"
                            richColors
                        />
                    </ThemeProvider>
                </NextIntlClientProvider>
                <ScrollToTopButton />
            </body>
        </html>
    );
}
