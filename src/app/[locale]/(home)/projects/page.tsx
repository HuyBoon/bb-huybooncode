"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

// 👇 IMPORT TỪ CONFIG
import { PROJECTS, TECH_ICONS_MAP } from "@/config/site";

// Animation Variants (Giữ nguyên)
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function ProjectPage() {
    const t = useTranslations("ProjectPage");
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-16"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4"
                    >
                        {t("title_1")}{" "}
                        <span className="text-primary">{t("title_2")}</span>
                    </motion.h1>
                    <motion.div
                        variants={itemVariants}
                        className="w-24 h-1.5 bg-linear-to-r from-primary to-secondary rounded-full mx-auto"
                    />
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        {t("subtitle")}
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                >
                    {/* 👇 DÙNG DỮ LIỆU TỪ CONFIG */}
                    {PROJECTS.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <div
                                    className={`absolute inset-0 pointer-events-none z-10 ${
                                        activeIndex === index
                                            ? "after:animate-[shineEffect_1s_ease-out_forwards]"
                                            : ""
                                    } after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:w-[200%] after:h-0 after:translate-x-[-50%] after:translate-y-[-50%] after:-rotate-45 after:bg-white/30 after:z-10`}
                                />
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    priority={index < 4}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/90 backdrop-blur-md text-foreground border border-border">
                                    {t(`status.${project.status}`)}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                </div>
                                <p className="text-muted-foreground text-sm sm:text-base mb-6 line-clamp-3 leading-relaxed grow">
                                    {t(`descriptions.${project.key}`)}
                                </p>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
                                            >
                                                {/* 👇 DÙNG ICON MAP TỪ CONFIG */}
                                                {TECH_ICONS_MAP[tech]}
                                                <span>{tech}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 whitespace-nowrap"
                                    >
                                        {project.status === "in_progress"
                                            ? t("developing")
                                            : t("view_demo")}
                                        <ExternalLink size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
