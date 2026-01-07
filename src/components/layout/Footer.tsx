"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl"; // Import

const Footer = () => {
    const t = useTranslations("Footer"); // Namespace
    const tNav = useTranslations("Navigation"); // Namespace cho menu
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Github, href: "https://github.com/HuyBoon", label: "GitHub" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Mail, href: "mailto:contact@huybooncode.com", label: "Email" },
    ];

    const navLinks = [
        { name: tNav("services"), href: "/services" },
        { name: tNav("projects"), href: "/projects" },
        { name: tNav("about"), href: "/#about" },
        // { name: tNav("blog"), href: "/blog" },
    ];

    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    <div className="md:col-span-5 flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-xl font-bold text-foreground flex items-center gap-0.5 group"
                        >
                            <span className="text-primary group-hover:-translate-x-1 transition-transform">
                                &lt;
                            </span>
                            <span className="tracking-tight">HuyBoonCode</span>
                            <span className="text-primary group-hover:translate-x-1 transition-transform">
                                /&gt;
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                            {t("slogan")}
                        </p>
                        <div className="flex gap-4 mt-2">
                            {/* ... Giữ nguyên social icons ... */}
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3 }}
                                    className="p-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-foreground transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="font-bold text-foreground mb-6 font-mono">
                            {t("explore")}
                        </h3>
                        <ul className="space-y-4">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit"
                                    >
                                        {link.name}
                                        <ArrowUpRight
                                            size={14}
                                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="font-bold text-foreground mb-6 font-mono">
                            {t("status")}
                        </h3>
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 w-fit px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {t("available")}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">
                            {t("contact_text")}
                        </p>
                        <a
                            href="mailto:contact@huybooncode.com"
                            className="text-foreground font-semibold hover:text-primary transition-colors underline decoration-primary decoration-2 underline-offset-4"
                        >
                            contact@huybooncode.com
                        </a>
                    </div>
                </div>

                <div className="border-t border-border pt-8 justify-between text-center items-center gap-4 text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {t("rights")}
                    </p>
                    {/* <div className="flex gap-6">
                        <Link
                            href="/privacy"
                            className="hover:text-foreground transition-colors"
                        >
                            {t("privacy")}
                        </Link>
                        <Link
                            href="/terms"
                            className="hover:text-foreground transition-colors"
                        >
                            {t("terms")}
                        </Link>
                    </div> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
