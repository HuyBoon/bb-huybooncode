"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight, Facebook } from "lucide-react";
import { FaTiktok } from "react-icons/fa"; // Cài react-icons nếu chưa có
import { useTranslations } from "next-intl";

const Footer = () => {
    const t = useTranslations("Footer");
    const tNav = useTranslations("Navigation");
    const currentYear = new Date().getFullYear();

    // Danh sách Social đầy đủ
    const socialLinks = [
        { icon: Github, href: "https://github.com/HuyBoon", label: "GitHub" },
        {
            icon: Linkedin,
            href: "https://www.linkedin.com/in/huy-boon-438168398/",
            label: "LinkedIn",
        },
        {
            icon: Facebook,
            href: "https://www.facebook.com/dany.vuong.1/",
            label: "Facebook",
        },
        {
            icon: FaTiktok,
            href: "https://www.tiktok.com/@boonhuy",
            label: "TikTok",
        },
        { icon: Mail, href: "mailto:huybooncode74@gmail.com", label: "Email" },
    ];

    const navLinks = [
        { name: tNav("services"), href: "/services" },
        { name: tNav("projects"), href: "/projects" },
        { name: tNav("about"), href: "/portfolio#about" },
    ];

    return (
        <footer className="bg-background border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-24">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5 flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-xl font-bold text-foreground flex items-center gap-0.5 group w-fit"
                        >
                            <span className="text-primary group-hover:-translate-x-1 transition-transform">
                                &lt;
                            </span>
                            <span className="tracking-tight">HuyBoonTech</span>
                            <span className="text-primary group-hover:translate-x-1 transition-transform">
                                /&gt;
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm leading-relaxed">
                            {t("slogan")}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer me" // "me" giúp Google xác thực profile chính chủ
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    className="p-2.5 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-foreground transition-all duration-200 border border-transparent hover:border-primary/20"
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h3 className="font-bold text-foreground mb-6 font-mono text-sm uppercase tracking-widest">
                            {t("explore")}
                        </h3>
                        <ul className="space-y-4">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group w-fit text-sm md:text-base font-medium"
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

                    {/* Status & Contact */}
                    <div className="md:col-span-4">
                        <h3 className="font-bold text-foreground mb-6 font-mono text-sm uppercase tracking-widest">
                            {t("status")}
                        </h3>
                        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 w-fit px-3 py-1.5 rounded-full text-xs font-bold mb-4 border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            {t("available")}
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                            {t("contact_text")}
                        </p>
                        <a
                            href="mailto:huybooncode74@gmail.com"
                            className="text-foreground font-bold hover:text-primary transition-colors underline decoration-primary/30 decoration-2 underline-offset-8 hover:decoration-primary"
                        >
                            huybooncode74@gmail.com
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                        &copy; {currentYear} {t("rights")}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
