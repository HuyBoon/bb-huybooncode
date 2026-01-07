import "@/app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/libs/getMessages";
import { routing } from "@/i18n/routing";

import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

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
    title: "HuyBoonCode",
    description: "HuyBoon Code - Professional Web Solutions",
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
        : "vi";

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
            </body>
        </html>
    );
}
