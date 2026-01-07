"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const About = () => {
    const t = useTranslations("HomePage.About");

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

    return (
        <section className="relative px-4 sm:px-6 lg:px-12 xl:px-24 py-12">
            <div className="relative max-w-6xl mx-auto">
                <motion.div
                    className="relative p-6 sm:p-10 rounded-3xl overflow-hidden bg-muted/20 border border-border/50 backdrop-blur-sm"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                        <motion.div
                            variants={itemVariants}
                            className="md:col-span-5 flex justify-center md:justify-center"
                        >
                            <div className="relative group">
                                <div className="absolute inset-0 bg-linear-to-tr from-primary to-secondary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-background shadow-2xl"
                                >
                                    <Image
                                        src="/huybooncode.png"
                                        alt="HuyBoonCode Avatar"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            className="md:col-span-7 flex flex-col justify-center text-center md:text-left"
                        >
                            <div className="mb-6">
                                <motion.h2
                                    variants={itemVariants}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2"
                                >
                                    {t("title")}{" "}
                                    <span className="text-primary">
                                        {t("me")}
                                    </span>
                                </motion.h2>
                                <motion.div
                                    variants={itemVariants}
                                    className="h-1.5 w-20 bg-linear-to-r from-primary to-secondary rounded-full mx-auto md:mx-0 opacity-80"
                                />
                            </div>

                            <motion.p
                                variants={itemVariants}
                                className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed"
                            >
                                {t.rich("description", {
                                    // Tag 'strong' trong JSON sẽ được thay thế bằng Component này
                                    strong: (chunks) => (
                                        <strong className="text-foreground">
                                            {chunks}
                                        </strong>
                                    ),

                                    // Tag 'span' trong JSON sẽ được thay thế bằng Component này
                                    span: (chunks) => (
                                        <span className="text-primary font-medium">
                                            {chunks}
                                        </span>
                                    ),
                                })}
                            </motion.p>

                            <motion.div
                                variants={containerVariants}
                                className="grid grid-cols-2 gap-4 sm:gap-6"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="p-4 rounded-2xl bg-background border border-border shadow-sm hover:border-primary/50 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Briefcase size={20} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">
                                            1.5+
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                        {t("years_experience")}
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="p-4 rounded-2xl bg-background border border-border shadow-sm hover:border-secondary/50 transition-colors group text-left"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-foreground">
                                            5+
                                        </h3>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground group-hover:text-secondary transition-colors">
                                        {t("projects_completed")}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
