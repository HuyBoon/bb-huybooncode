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
        template: "%s | HuyBoonCode - Frontend Developer",
        default:
            "HuyBoonTech | Frontend Developer & Professional Web Solutions",
    },
    description:
        "HuyBoonCode là một Frontend Developer chuyên nghiệp với hơn 1 năm kinh nghiệm, chuyên cung cấp các giải pháp thiết kế website, Landing Page và Web App hiện đại, tối ưu SEO.",
    keywords: [
        "HuyBoonTech",
        "Frontend Developer",
        "Thiết kế website",
        "Next.js",
        "React Developer",
        "Web Solutions",
    ],
    openGraph: {
        title: "HuyBoonTech | Professional Web Solutions",
        description:
            "Chuyên xây dựng các website hoàn hảo, hấp dẫn và hiệu suất cao.",
        url: "https://huyboon.tech",
        siteName: "HuyBoonCode",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "vi_VN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "HuyBoonTech | Frontend Developer",
        description: "Professional Web Development Services",
        images: ["/og-image.png"],
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
