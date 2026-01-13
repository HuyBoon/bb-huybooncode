"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, Code2 } from "lucide-react";
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import {
    SiFirebase,
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";

const techIcons: Record<string, React.ReactNode> = {
    React: <FaReact className="w-4 h-4 text-[#61DAFB]" />,
    "Next.js": <SiNextdotjs className="w-4 h-4 text-black dark:text-white" />,
    Tailwind: <SiTailwindcss className="w-4 h-4 text-[#06B6D4]" />,
    TypeScript: <SiTypescript className="w-4 h-4 text-[#3178C6]" />,
    Firebase: <SiFirebase className="w-4 h-4 text-[#FFCA28]" />,
    "Node.js": <FaNodeJs className="w-4 h-4 text-[#339933]" />,
    HTML: <FaHtml5 className="w-4 h-4 text-[#e34c26]" />,
    CSS: <FaCss3Alt className="w-4 h-4 text-[#264de4]" />,
};

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

    const projects = [
        {
            id: 1,
            title: "Thùy Dương Spa",
            key: "thuyduong",
            tech: ["React", "Next.js", "Tailwind"],
            image: "/projects/thuyduongspa.png",
            demoLink: "https://spathuyduong.vn/vi",
            status: "in_progress",
        },
        {
            id: 2,
            title: "Amazing Phú Quốc",
            key: "amazing",
            tech: ["React", "Node.js", "Tailwind"],
            image: "/projects/amazingphuquoc.png",
            demoLink: "https://hellophuquoc.vn/",
            status: "completed",
        },
        {
            id: 3,
            title: "MK-Nails & Spa",
            key: "mknails",
            tech: ["React", "TypeScript", "Tailwind"],
            image: "/projects/mknails.png",
            demoLink: "https://mknailsportdover.com/",
            status: "completed",
        },
        {
            id: 4,
            title: "Varia Hotel",
            key: "varia",
            tech: ["React", "Next.js", "TypeScript", "Tailwind"],
            image: "/projects/variahotel.png",
            demoLink: "https://varia-nine.vercel.app/",
            status: "in_progress",
        },
        {
            id: 5,
            title: "E-commerce Website",
            key: "ecommerce",
            tech: ["React", "Next.js", "Tailwind"],
            image: "/projects/ecommerce.png",
            demoLink: "https://kimvinhstore.vercel.app/",
            status: "completed",
        },
        {
            id: 6,
            title: "Phú Quốc's Travel",
            key: "tour",
            tech: ["TypeScript", "Node.js", "Tailwind"],
            image: "/projects/tour.png",
            demoLink: "https://hiddensunphuquoc.vercel.app/",
            status: "completed",
        },
        {
            id: 7,
            title: "Blog Platform",
            key: "blog",
            tech: ["Next.js", "Firebase", "Tailwind"],
            image: "/projects/blog.png",
            demoLink: "https://mereview.vercel.app/vi",
            status: "completed",
        },
        {
            id: 8,
            title: "Kyles Skincare",
            key: "skincare",
            tech: ["React", "Next.js", "TypeScript", "Tailwind"],
            image: "/projects/landing.png",
            demoLink: "https://kyleskincare.vn/",
            status: "completed",
        },
    ];

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
            <div className="max-w-7xl mx-auto">
                {/* --- HEADER --- */}
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
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl"
                        >
                            {/* Image & Shine Effect */}
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

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background/90 backdrop-blur-md text-foreground border border-border">
                                    {t(`status.${project.status}`)}
                                </div>
                            </div>

                            {/* Content */}
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
                                    {/* Tech Icons */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
                                            >
                                                {techIcons[tech]}
                                                <span>{tech}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Button */}
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
