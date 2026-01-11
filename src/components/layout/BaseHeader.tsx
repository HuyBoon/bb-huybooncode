"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { ThemeButtons } from "../ui/ThemeButtons";
import { Github, Linkedin } from "lucide-react";
import { Session } from "next-auth";
import { UserNav } from "./UserNav";
import { MobileNav } from "./MobileNav";

interface NavItem {
    label: string;
    href: string;
}

interface BaseHeaderProps {
    navItems: NavItem[];
    showSocials?: boolean;
    session: Session | null;
}

const BaseHeader = ({
    navItems,
    showSocials = false,
    session,
}: BaseHeaderProps) => {
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
    const BTN_CLASS =
        "flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200";

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
                        isScrolled || isMenuOpen
                            ? "bg-background/80 backdrop-blur-xl shadow-sm border-b border-border/40 py-2"
                            : "bg-transparent py-4"
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-12 sm:h-14 relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center shrink-0"
                            >
                                <Link
                                    href="/"
                                    className="text-xl font-bold flex items-center gap-0.5 group"
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

                            <div className="hidden lg:flex items-center gap-1 bg-muted/40 backdrop-blur-md px-1.5 py-1 rounded-full border border-border/40 shadow-sm absolute left-1/2 -translate-x-1/2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-background/50"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden lg:flex items-center gap-2 mr-2">
                                    {showSocials && (
                                        <div className="flex items-center gap-2 pr-4 border-r border-border/40">
                                            <Link
                                                href="https://github.com/HuyBoon"
                                                target="_blank"
                                                className={BTN_CLASS}
                                            >
                                                <Github size={20} />
                                            </Link>
                                            <Link
                                                href="https://linkedin.com"
                                                target="_blank"
                                                className={BTN_CLASS}
                                            >
                                                <Linkedin size={20} />
                                            </Link>
                                        </div>
                                    )}
                                    <button
                                        onClick={toggleLanguage}
                                        className={`${BTN_CLASS} text-xs font-bold`}
                                    >
                                        {locale.toUpperCase()}
                                    </button>
                                </div>
                                <ThemeButtons />
                                <UserNav session={session} />
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`lg:hidden ${BTN_CLASS}`}
                                >
                                    {isMenuOpen ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <MobileNav
                        isOpen={isMenuOpen}
                        setIsOpen={setIsMenuOpen}
                        navItems={navItems}
                        locale={locale}
                        toggleLanguage={toggleLanguage}
                        showSocials={showSocials}
                        session={session}
                    />
                </nav>
            </motion.div>
        </header>
    );
};

export default BaseHeader;
