"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, LogIn } from "lucide-react"; // Import LogIn icon
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button"; // Import Button
import { useTranslations } from "next-intl"; // Import Hook dịch
import { Session } from "next-auth"; // Import type Session

interface NavItem {
    label: string;
    href: string;
}

interface MobileNavProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    navItems: NavItem[];
    locale: string;
    toggleLanguage: () => void;
    showSocials: boolean;
    session: Session | null; // <--- THÊM PROP NÀY
}

export function MobileNav({
    isOpen,
    setIsOpen,
    navItems,
    locale,
    toggleLanguage,
    showSocials,
    session, // <--- NHẬN PROP
}: MobileNavProps) {
    const t = useTranslations("Navigation"); // Hook dịch

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="lg:hidden absolute top-full left-0 right-0 border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden"
                >
                    <div className="p-4 space-y-4">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* --- KHU VỰC LOGIN CHO MOBILE --- */}
                        {!session && (
                            <div className="px-2 pb-2">
                                <Button
                                    className="w-full rounded-lg font-bold"
                                    size="lg"
                                    asChild
                                >
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LogIn className="mr-2 h-4 w-4" />{" "}
                                        {t("login")}
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* Footer: Language & Socials */}
                        <div className="pt-4 border-t border-border/50 flex items-center justify-between px-2">
                            <button
                                onClick={toggleLanguage}
                                className="text-sm font-bold px-4 py-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                            >
                                Ngôn ngữ: {locale.toUpperCase()}
                            </button>

                            {showSocials && (
                                <div className="flex gap-4">
                                    <Link
                                        href="https://github.com/HuyBoon"
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Github size={22} />
                                    </Link>
                                    <Link
                                        href="https://linkedin.com"
                                        target="_blank"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Linkedin size={22} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
