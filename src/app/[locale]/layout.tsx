import "@/app/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/libs/getMessages";
import { routing } from "@/i18n/routing";

import { Playfair_Display, Lora } from "next/font/google";
import { Toaster } from "sonner";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";

const playfair = Playfair_Display({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-playfair",
	display: "swap",
});

const lora = Lora({
	subsets: ["latin", "vietnamese"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-lora",
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

	const localeRaw = routing.locales.includes(locale as any)
		? (locale as "vi" | "en" | "ko")
		: "vi";

	if (!routing.locales.includes(localeRaw)) {
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
		<html
			lang={localeRaw}
			className={`${playfair.variable} ${lora.variable}  scroll-smooth`}
		>
			<body className="font-lora">
				<NextIntlClientProvider locale={localeRaw} messages={messages}>
					<main>{children}</main>
					<ScrollToTopButton />
					<Toaster position="top-right" theme="light" richColors />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
