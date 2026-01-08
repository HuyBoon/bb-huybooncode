"use client";

import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
    Briefcase,
    Calendar,
    MapPin,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }, // Đã fix lỗi type ở đây
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
    },
};

const ProfessionalExperience = () => {
    const t = useTranslations("HomePage.Experience");
    const [showAll, setShowAll] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const experiences = [
        {
            id: 1,

            start: "2023",

            end: t("present"),

            title: "Freelance Developer",

            company: "Independent",

            location: "Remote",

            details: t.raw("freelance_details"),

            technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
        },

        {
            id: 2,

            start: "2021",

            end: "2023",

            title: "Business Manager",

            company: "Music Lounge - Color of the Wind",

            location: "Ho Chi Minh City",

            details: t.raw("business_details"),

            technologies: ["Management", "Marketing", "Operation"],
        },

        {
            id: 3,

            start: "2020",

            end: "2020",

            title: "Graduation",

            company: "HCMC University of Technology",

            location: "Ho Chi Minh City",

            details: t.raw("graduation_details"),

            technologies: ["Mechatronics", "Engineering"],
        },

        {
            id: 4,

            start: "2019",

            end: "2020",

            title: "Manual Tester",

            company: "TMA Solutions",

            location: "Ho Chi Minh City",

            details: t.raw("tester_details"),

            technologies: ["Jira", "Manual Testing", "Teamwork"],
        },
    ];

    const toggleShowAll = () => {
        if (showAll) {
            sectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            setTimeout(() => setShowAll(false), 300);
        } else {
            setShowAll(true);
        }
    };

    const visibleExperiences = showAll ? experiences : experiences.slice(0, 2);

    return (
        <section
            ref={sectionRef}
            id="experience"
            className="relative px-4 sm:px-6 lg:px-12 xl:px-24 py-12 scroll-mt-20 overflow-hidden"
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="flex flex-col items-center mb-12 text-center"
            >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {t("title_1")}{" "}
                    <span className="text-primary">{t("title_2")}</span>
                </h2>
                <div className="h-1.5 w-20 bg-linear-to-r from-primary to-secondary rounded-full opacity-80" />
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
                {/* Timeline Line: Điều chỉnh vị trí trên mobile để không bị quá sát lề */}
                <div className="absolute left-2 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-0.5 bg-border dark:bg-white/10" />

                <motion.div layout className="relative flex flex-col w-full">
                    <AnimatePresence mode="popLayout">
                        {visibleExperiences.map((exp, index) => {
                            const isLeft = index % 2 === 0;
                            return (
                                <motion.div
                                    key={exp.id}
                                    layout
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className={`mb-10 flex w-full flex-col sm:flex-row items-center sm:items-start ${
                                        isLeft
                                            ? "sm:justify-start"
                                            : "sm:justify-end"
                                    }`}
                                >
                                    {/* Dot: Căn chỉnh lại theo vị trí mới của line */}
                                    <div className="absolute left-2 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-background border-[3px] border-primary z-10 mt-1.5 shadow-lg shadow-primary/20" />

                                    {/* Card: Sửa width và margin trên mobile để không lấn viền */}
                                    <div
                                        className={`relative w-[calc(100%-2.5rem)] sm:w-[45%] ml-auto sm:ml-0 p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all group ${
                                            isLeft ? "sm:mr-auto" : "sm:ml-auto"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-1 mb-3">
                                            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-primary font-mono bg-primary/10 w-fit px-2 py-1 rounded">
                                                <Calendar size={12} />
                                                {exp.start} - {exp.end}
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {exp.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-4 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={12} />
                                                {exp.company}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {exp.location}
                                            </div>
                                        </div>

                                        <ul className="mb-4 space-y-2">
                                            {exp.details.map(
                                                (detail: string, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2"
                                                    >
                                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                                                        <span className="leading-relaxed">
                                                            {detail}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>

                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                                            {exp.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                <motion.div className="mt-4 text-center relative z-20">
                    <button
                        onClick={toggleShowAll}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:-translate-y-1 transition-all"
                    >
                        {showAll ? (
                            <>
                                <ChevronUp size={18} /> {t("collapse")}
                            </>
                        ) : (
                            <>
                                <ChevronDown size={18} /> {t("view_more")}
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default ProfessionalExperience;
