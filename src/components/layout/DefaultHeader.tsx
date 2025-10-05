"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeButtons } from "../ui/ThemeButtons";

const DefaultHeader = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { theme, resolvedTheme } = useTheme();

	const { scrollY } = useScroll();
	const t = useTranslations("Header");
	const locale = useLocale();
	const router = useRouter();

	useMotionValueEvent(scrollY, "change", (latest) => {
		setIsScrolled(latest > 50);
	});

	const toggleLanguage = () => {
		router.push(`/${locale === "vi" ? "en" : "vi"}`);
	};

	const navItems = [
		{ href: "/services", label: t("services") },
		{ href: "/projects", label: t("projects") },
		{ href: "/portfolio", label: t("portfolio") },
		{ href: "/blog", label: t("blog") },
		{ href: "/contact", label: t("contact") },
	];

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`fixed w-full z-50 transition-all duration-300 ease-out ${
				isScrolled
					? "bg-white/10 dark:bg-black/30 backdrop-blur-xl shadow-lg"
					: "bg-transparent backdrop-blur-sm"
			}`}
			data-theme={resolvedTheme || theme}
		>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 sm:py-4">
				<div className="flex items-center justify-between relative z-10">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
					>
						<Link
							href="/"
							scroll={true}
							className="text-lg font-bold text-primary dark:text-primary/90"
						>
							HuyBoonCode.
						</Link>
					</motion.div>

					{/* Desktop menu */}
					<div className="hidden md:flex items-center gap-4 lg:gap-6">
						<div className="flex items-center gap-2 bg-white/10 dark:bg-gray-800/40 px-3 py-1.5 rounded-full border border-white/10 dark:border-gray-700 shadow-md">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="px-3 py-1.5 text-sm lg:text-base text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors"
								>
									{item.label}
								</Link>
							))}
						</div>

						<div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

						<div className="flex items-center gap-2">
							<button
								onClick={toggleLanguage}
								className="h-9 px-3 cursor-pointer text-sm font-semibold rounded-lg 
									bg-white/10 hover:bg-primary/20 
									dark:bg-gray-800 dark:hover:bg-primary/40 
									transition-colors text-gray-900 dark:text-gray-100"
							>
								{locale.toUpperCase()}
							</button>

							{/* Nút dark/light icon */}
							<ThemeButtons />
						</div>
					</div>

					{/* Mobile menu toggle */}
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 rounded-lg bg-white/10 dark:bg-gray-800 hover:bg-primary/20 dark:hover:bg-primary/40 transition-colors"
					>
						{isMenuOpen ? (
							<XMarkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
						) : (
							<Bars3Icon className="h-6 w-6 text-gray-900 dark:text-white" />
						)}
					</button>
				</div>

				{/* Mobile menu content */}
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="md:hidden mt-4 pb-6 bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg"
					>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsMenuOpen(false)}
								className="block px-4 py-2 text-base text-gray-900 dark:text-white hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
							>
								{item.label}
							</Link>
						))}

						<div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 px-4">
							<button
								onClick={toggleLanguage}
								className="h-9 px-3 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/40 flex items-center justify-center transition-colors"
							>
								{locale.toUpperCase()}
							</button>
							<ThemeButtons />
						</div>
					</motion.div>
				)}
			</div>
		</motion.nav>
	);
};

export default DefaultHeader;
