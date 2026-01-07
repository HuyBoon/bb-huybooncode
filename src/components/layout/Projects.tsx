"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react"; // Import useState
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import {
    SiFirebase,
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";
import { ExternalLink, ArrowRight } from "lucide-react";

// Map icon công nghệ (Giữ nguyên)
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
        transition: { duration: 0.6, staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects() {
    const t = useTranslations("HomePage.Projects");
    const router = useRouter();
    // State để điều khiển hiệu ứng Shine
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const projects = [
        {
            title: "Thùy Dương Spa",
            description: t("thuyduong_desc"),
            tech: ["React", "Next.js", "Tailwind"],
            image: "/projects/thuyduongspa.png",
            demoLink: "https://thuyduongspa.vercel.app/",
            status: "developing",
        },
        {
            title: "Amazing Phú Quốc",
            description: t("amazing_desc"),
            tech: ["React", "Node.js", "Tailwind"],
            image: "/projects/amazingphuquoc.png",
            demoLink: "https://hellophuquoc.vn/",
            status: "completed",
        },
        {
            title: "MK-Nails & Spa",
            description: t("mknails_desc"),
            tech: ["React", "TypeScript", "Tailwind"],
            image: "/projects/mknails.png",
            demoLink: "https://hb-mknails.vercel.app/",
            status: "completed",
        },
        {
            title: "Varia Hotel",
            description: t("varia_desc"),
            tech: ["React", "Next.js", "TypeScript", "Tailwind"],
            image: "/projects/variahotel.png",
            demoLink: "https://hb-variahotel.vercel.app/vi",
            status: "developing",
        },
    ];

    const handleToProject = () => {
        router.push(`/projects`);
    };

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
        // Logic cho mobile (Giữ nguyên từ code cũ của bạn)
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
            setTimeout(() => {
                setActiveIndex(null);
            }, 1000);
        }
    };

    const handleMouseLeave = () => {
        if (typeof window !== "undefined" && window.innerWidth > 768) {
            setActiveIndex(null);
        }
    };

    return (
        <section className="relative py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
                {/* --- HEADER --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
                    >
                        {t("title_1")}{" "}
                        <span className="text-primary">{t("title_2")}</span>
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto opacity-80"
                    />
                    <motion.p
                        variants={itemVariants}
                        className="mt-4 text-muted-foreground max-w-2xl mx-auto"
                    >
                        {t("subtitle")}
                    </motion.p>
                </motion.div>

                {/* --- PROJECTS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            // Thêm các event handler để kích hoạt hiệu ứng
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleMouseEnter(index)} // Hỗ trợ mobile
                            className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                        >
                            {/* Image Section */}
                            <div className="relative aspect-video overflow-hidden">
                                {/* --- SHINE EFFECT CŨ ĐÃ ĐƯỢC KHÔI PHỤC --- */}
                                <div
                                    className={`absolute inset-0 pointer-events-none z-10 ${
                                        activeIndex === index
                                            ? "after:animate-[shineEffect_1s_ease-out_forwards]"
                                            : ""
                                    } after:absolute after:content-[''] after:left-1/2 after:top-1/2 after:w-[200%] after:h-0 after:translate-x-[-50%] after:translate-y-[-50%] after:rotate-[-45deg] after:bg-white/30 after:z-10`}
                                />

                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {/* Overlay Gradient nhẹ khi hover để tăng độ sâu */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-background/90 backdrop-blur-md text-foreground shadow-sm border border-border">
                                    {t(`status.${project.status}`)}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                                    {project.title}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow leading-relaxed">
                                    {project.description}
                                </p>

                                {/* Footer: Tech Stack + Button */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto border-t border-border pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-foreground border border-transparent hover:border-primary/30 transition-colors"
                                                title={tech}
                                            >
                                                {techIcons[tech]}
                                                <span>{tech}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Nút View Demo chỉ là link ngoài, không cần onClick của card */}
                                    <Link
                                        href={project.demoLink}
                                        target="_blank"
                                        // Dừng nổi bọt sự kiện để không kích hoạt lại Shine Effect khi bấm vào nút
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 whitespace-nowrap"
                                    >
                                        {t("view_demo")}{" "}
                                        <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- VIEW ALL BUTTON --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-12 sm:mt-16"
                >
                    <button
                        className="group relative px-8 py-3 rounded-full bg-background border border-border hover:border-primary text-foreground font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                        onClick={handleToProject}
                    >
                        {t("view_all")}
                        <ArrowRight
                            size={16}
                            className="text-primary group-hover:translate-x-1 transition-transform"
                        />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
