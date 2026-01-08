"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ThemeButtons } from "../ui/ThemeButtons";
import { Github, Linkedin } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
}

interface BaseHeaderProps {
    navItems: NavItem[];
    showSocials?: boolean;
}

const BaseHeader = ({ navItems, showSocials = false }: BaseHeaderProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = () => {
        const newLocale = locale === "vi" ? "en" : "vi";
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    const iconBtnClass =
        "flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200";
    const langBtnClass =
        "flex items-center justify-center h-8 px-3 rounded-lg text-sm font-semibold text-foreground hover:text-primary hover:bg-muted transition-all duration-200";

    return (
        <header className="fixed top-0 left-0 w-full z-999">
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full"
            >
                <nav
                    className={`w-full transition-all duration-300 ease-out ${
                        isScrolled
                            ? "bg-background/80 backdrop-blur-xl shadow-md border-b border-border/50 py-2" // Khi scroll
                            : "bg-transparent py-4"
                    }`}
                >
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-12 sm:h-14 relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center"
                            >
                                <Link
                                    href="/"
                                    className="text-xl font-bold text-foreground flex items-center gap-0.5 group"
                                >
                                    <span className="text-primary group-hover:-translate-x-1 transition-transform">
                                        &lt;
                                    </span>
                                    <span className="tracking-tight">
                                        HuyBoonTech
                                    </span>
                                    <span className="text-primary group-hover:translate-x-1 transition-transform">
                                        /&gt;
                                    </span>
                                </Link>
                            </motion.div>

                            <div className="hidden lg:flex items-center gap-4 lg:gap-6">
                                <div className="flex items-center gap-1 bg-background/60 dark:bg-gray-800/40 backdrop-blur-md px-2 py-1.5 rounded-full border border-border/50 shadow-sm">
                                    {navItems.map((item) => (
                                        <motion.div
                                            key={item.href}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className="px-4 py-1.5 text-sm lg:text-base font-medium text-muted-foreground hover:text-primary transition-colors block"
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1">
                                    {showSocials && (
                                        <>
                                            <Link
                                                href="https://github.com/HuyBoon"
                                                target="_blank"
                                                className={iconBtnClass}
                                            >
                                                <Github size={20} />
                                            </Link>
                                            <Link
                                                href="https://www.linkedin.com/in/huy-boon-438168398/"
                                                target="_blank"
                                                className={iconBtnClass}
                                            >
                                                <Linkedin size={20} />
                                            </Link>
                                            <div className="h-6 w-px bg-border mx-1" />
                                        </>
                                    )}
                                    <button
                                        onClick={toggleLanguage}
                                        className={langBtnClass}
                                    >
                                        {locale.toUpperCase()}
                                    </button>
                                    <div className="flex items-center justify-center w-7 h-7">
                                        <ThemeButtons />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 rounded-lg bg-muted/50 text-foreground hover:text-primary transition-colors"
                            >
                                {isMenuOpen ? (
                                    <XMarkIcon className="h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="h-6 w-6" />
                                )}
                            </button>
                        </div>

                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="lg:hidden absolute top-full left-4 right-4 mt-2 p-4 bg-background/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-border z-50"
                            >
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between px-2">
                                    <div className="flex gap-2">
                                        {showSocials && (
                                            <>
                                                <Link
                                                    href="https://github.com/HuyBoon"
                                                    target="_blank"
                                                    className={iconBtnClass}
                                                >
                                                    <Github size={20} />
                                                </Link>
                                                <Link
                                                    href="https://www.linkedin.com/in/huy-boon-438168398/"
                                                    target="_blank"
                                                    className={iconBtnClass}
                                                >
                                                    <Linkedin size={20} />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={toggleLanguage}
                                            className="font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-lg text-sm"
                                        >
                                            {locale.toUpperCase()}
                                        </button>
                                        <ThemeButtons />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </nav>
            </motion.div>
        </header>
    );
};

export default BaseHeader;
