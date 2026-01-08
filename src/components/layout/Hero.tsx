"use client";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { IoMdDownload } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    const { scrollY } = useScroll();
    const t = useTranslations("HomePage.Hero");
    const y = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <section className="relative overflow-hidden py-12 md:py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-24 pt-24 md:pt-32">
                <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative group md:w-1/2 z-10"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-center md:text-left"
                        >
                            Frontend
                            <br />
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="bg-linear-to-r from-primary via-blue-600 dark:via-white to-primary bg-clip-text text-transparent"
                            >
                                Developer
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg text-center md:text-left"
                        >
                            {t("description")}
                        </motion.p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/contact"
                                    className="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm md:text-base 
                                        shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2 transition-all"
                                >
                                    <HiOutlineMail className="w-5 h-5" />
                                    <span>{t("hire_me")}</span>
                                </Link>
                            </motion.div>

                            {/* --- NÚT MY CV (Thanh lịch) --- */}
                            <motion.a
                                href="/HuyBoon's CV.pdf"
                                download="HuyBoon_CV"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.3 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative overflow-hidden px-8 py-3.5 rounded-full 
                                    bg-white border border-gray-200 text-gray-900 shadow-sm
                                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-none
                                    hover:border-primary dark:hover:border-primary transition-all group cursor-pointer"
                            >
                                <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium group-hover:text-primary transition-colors">
                                    <IoMdDownload className="w-5 h-5" />
                                    <span>{t("my_cv")}</span>
                                </div>
                            </motion.a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            ease: "easeOut",
                        }}
                        className="md:w-1/2 relative hidden md:block"
                        style={{ y }}
                    >
                        <div className="relative w-[90%] mx-auto aspect-3/2 group">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                }}
                                className="absolute -inset-1 rounded-4xl bg-linear-to-r from-primary/20 via-secondary/20 to-primary/20 blur-2xl opacity-40 dark:opacity-60"
                            />

                            <div className="relative w-full h-full rounded-4xl p-2 bg-linear-to-br from-white/50 to-white/20 dark:from-white/10 dark:to-transparent border border-white/20 backdrop-blur-sm">
                                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <Image
                                        src="/huybooncode.png"
                                        alt="Huy Boon Code Avatar"
                                        fill
                                        className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-in-out"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 dark:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
