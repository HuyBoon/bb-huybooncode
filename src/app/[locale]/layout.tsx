import "@/app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/libs/getMessages";
import { routing } from "@/i18n/routing";
import { Jost, Lora } from "next/font/google";
import { Toaster } from "sonner";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { ThemeProvider } from "next-themes";

const lora = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-lora",
	display: "swap",
});

const jost = Jost({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-jost",
	display: "swap",
});

export const metadata: Metadata = {
	title: "HuyBoonCode",
	description: "HuyBoon Code.",
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

	const fontClass = localeRaw === "vi" ? lora.variable : jost.variable;

	return (
		<html lang={localeRaw}>
			<body className={`${fontClass} font-lora`}>
				<NextIntlClientProvider locale={localeRaw} messages={messages}>
					<ThemeProvider
						attribute="data-theme"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main>{children}</main>
						<ScrollToTopButton />
						<Toaster position="top-right" theme="system" richColors />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
