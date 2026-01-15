"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

// 👇 IMPORT TỪ CONFIG
import { TECH_STACK_LIST, PROFILE } from "@/config/site";

// Animation variants (Giữ nguyên)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
const hoverScale = { scale: 1.02, transition: { duration: 0.2 } };

export default function HomePage() {
    const t = useTranslations("HomePage.Landing");

    return (
        <section className="min-h-screen py-12 px-4 sm:px-6 lg:px-12 flex flex-col justify-center">
            <div className="max-w-6xl mx-auto w-full">
                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-foreground mb-4"
                    >
                        Hi, I'm{" "}
                        <span className="text-primary">
                            {t("greeting_name")}
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-muted-foreground max-w-2xl"
                    >
                        {t("description")}
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px]"
                >
                    {/* AVATAR CARD */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={hoverScale}
                        className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group border border-border bg-card shadow-sm"
                    >
                        <Image
                            src={PROFILE.avatar} // 👇 Dùng từ Config
                            alt={PROFILE.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                    </motion.div>

                    {/* LOCATION CARD */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={hoverScale}
                        className="relative rounded-3xl bg-[#242938] border border-border flex flex-col items-center justify-center p-6 text-center overflow-hidden shadow-sm"
                    >
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
                        <div className="relative z-10 bg-primary/20 p-3 rounded-full mb-3 text-primary animate-bounce">
                            <MapPin size={24} />
                        </div>
                        <h3 className="relative z-10 text-white font-bold text-lg">
                            {t("location_city")}
                        </h3>
                        <p className="relative z-10 text-gray-400 text-sm">
                            {t("location_country")}
                        </p>
                    </motion.div>

                    {/* CONTACT CARD */}
                    <motion.div
                        variants={itemVariants}
                        className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm"
                    >
                        <div className="flex gap-2">
                            <Link
                                href={PROFILE.social.github}
                                target="_blank"
                                className="p-3 bg-muted rounded-2xl hover:bg-[#333] hover:text-white transition-colors flex-1 flex items-center justify-center text-foreground"
                            >
                                <Github size={24} />
                            </Link>
                            <Link
                                href={PROFILE.social.linkedin}
                                target="_blank"
                                className="p-3 bg-muted rounded-2xl hover:bg-[#0077b5] hover:text-white transition-colors flex-1 flex items-center justify-center text-foreground"
                            >
                                <Linkedin size={24} />
                            </Link>
                        </div>
                        <Link
                            href={`mailto:${PROFILE.email}`}
                            className="mt-2 w-full py-3 bg-foreground text-background rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Mail size={16} /> {t("contact_me")}
                        </Link>
                    </motion.div>

                    {/* TECH STACK MARQUEE CARD */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-2 rounded-3xl border border-border bg-card flex flex-col justify-center overflow-hidden relative shadow-sm group"
                    >
                        <p className="absolute top-4 left-6 text-xs text-muted-foreground font-mono uppercase tracking-wider z-10">
                            {t("arsenal")}
                        </p>
                        <div className="flex overflow-hidden mask-linear-fade">
                            <motion.div
                                className="flex gap-8 items-center pr-8"
                                animate={{ x: "-50%" }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 15,
                                }}
                            >
                                {/* 👇 DÙNG LIST TỪ CONFIG (nhân đôi mảng để chạy loop) */}
                                {[...TECH_STACK_LIST, ...TECH_STACK_LIST].map(
                                    (tech, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center gap-2 group/icon min-w-15"
                                        >
                                            <div
                                                className={`text-4xl ${tech.color} transform group-hover/icon:scale-110 transition-transform duration-300`}
                                            >
                                                {/* Render Icon component */}
                                                <tech.icon />
                                            </div>
                                        </div>
                                    )
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
