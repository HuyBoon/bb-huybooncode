"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, staggerChildren: 0.1 },
    },
};

const Contact = () => {
    const t = useTranslations("HomePage.Contact");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error(t("error_fill"));
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            toast.success(t("success_message"));
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            toast.error(t("error_generic"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground";

    return (
        <section className="relative px-4 sm:px-6 lg:px-12 xl:px-24 py-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                        {t("title_1")}{" "}
                        <span className="text-primary">{t("title_2")}</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-linear-to-r from-primary to-secondary rounded-full mx-auto opacity-80" />
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col h-full"
                    >
                        <h3 className="text-2xl font-bold text-foreground mb-6">
                            {t("info_title")}
                        </h3>

                        <ul className="space-y-6 mb-8">
                            <li className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        Email
                                    </p>
                                    <a
                                        href="mailto:huybooncode74@gmail.com"
                                        className="text-foreground font-semibold hover:text-primary transition-colors"
                                    >
                                        huybooncode74@gmail.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Linkedin size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        LinkedIn
                                    </p>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        className="text-foreground font-semibold hover:text-primary transition-colors"
                                    >
                                        Connect on LinkedIn
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Github size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        GitHub
                                    </p>
                                    <a
                                        href="https://github.com/HuyBoon"
                                        target="_blank"
                                        className="text-foreground font-semibold hover:text-primary transition-colors"
                                    >
                                        Explore Projects
                                    </a>
                                </div>
                            </li>
                        </ul>

                        <div className="relative mt-auto rounded-xl overflow-hidden border border-border aspect-video group w-full">
                            <Image
                                src="/huybooncode.png"
                                alt="HuyBoonCode"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white font-mono text-sm">
                                &lt;Let's Build Together /&gt;
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-lg shadow-primary/5 h-full flex flex-col justify-center"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                {t("form_title")}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                {t("form_subtitle")}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t("label_name")}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("placeholder_name")}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t("label_email")}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="example@gmail.com"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        {t("label_message")}
                                    </label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("placeholder_message")}
                                        className={`${inputClass} resize-none h-32`}
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full relative px-6 py-3.5 rounded-lg bg-linear-to-r from-primary to-secondary text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                                        isSubmitting
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isSubmitting ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            {t("btn_send")} <Send size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
