"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Send, MapPin, Phone } from "lucide-react";
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

const ContactPage = () => {
    const t = useTranslations("HomePage.Contact");

    // State Form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Change
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate cơ bản
        if (!formData.name || !formData.email || !formData.message) {
            toast.error(t("error_fill") || "Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Gọi API /api/send-email mà bạn đã tạo
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            toast.success(t("success_message") || "Message sent successfully!");
            setFormData({ name: "", email: "", message: "" }); // Reset form
        } catch (err) {
            console.error(err);
            toast.error(
                t("error_generic") || "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full p-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground";

    return (
        // Thêm min-h-screen và pt-32 để tránh bị Header che mất nội dung
        <section className="min-h-screen relative px-4 sm:px-6 lg:px-12 xl:px-24 pt-32 pb-12 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full">
                {/* --- HEADER SECTION --- */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-12 sm:mb-16"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4">
                        {t("title_1")}{" "}
                        <span className="text-primary">{t("title_2")}</span>
                    </h1>
                    <div className="w-24 h-1.5 bg-linear-to-r from-primary to-secondary rounded-full mx-auto opacity-80" />
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* --- LEFT COLUMN: INFO & SOCIAL --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col h-full gap-6"
                    >
                        {/* Info Card */}
                        <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col gap-6">
                            <h3 className="text-2xl font-bold text-foreground">
                                {t("info_title")}
                            </h3>

                            <div className="space-y-4">
                                <a
                                    href="mailto:huybooncode74@gmail.com"
                                    className="flex items-center gap-4 group p-3 rounded-xl hover:bg-muted transition-colors"
                                >
                                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            Email
                                        </p>
                                        <p className="text-foreground font-semibold">
                                            huybooncode74@gmail.com
                                        </p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 group p-3 rounded-xl hover:bg-muted transition-colors">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            Location
                                        </p>
                                        <p className="text-foreground font-semibold">
                                            Ho Chi Minh City, Vietnam
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Icons Row */}
                            <div className="pt-6 mt-2 border-t border-border flex gap-4">
                                <a
                                    href="https://github.com/HuyBoon"
                                    target="_blank"
                                    className="flex-1 py-3 rounded-xl bg-muted hover:bg-foreground hover:text-background transition-colors flex justify-center items-center gap-2 font-medium"
                                >
                                    <Github size={20} /> GitHub
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    className="flex-1 py-3 rounded-xl bg-muted hover:bg-[#0077b5] hover:text-white transition-colors flex justify-center items-center gap-2 font-medium"
                                >
                                    <Linkedin size={20} /> LinkedIn
                                </a>
                            </div>
                        </div>

                        {/* Decor Image (Đẩy xuống đáy) */}
                        <div className="relative flex-1 min-h-50 rounded-3xl overflow-hidden border border-border group">
                            <Image
                                src="/huybooncode.png"
                                alt="HuyBoonCode"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <p className="text-primary font-mono text-sm mb-1">
                                    &lt;Status /&gt;
                                </p>
                                <p className="text-white font-bold text-xl">
                                    Open for opportunities
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: FORM --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full"
                    >
                        <div className="h-full p-8 rounded-3xl bg-card border border-border shadow-lg shadow-primary/5 flex flex-col justify-center">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    {t("form_title")}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t("form_subtitle")}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5 flex-1 flex flex-col"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">
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
                                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">
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
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-foreground mb-2 ml-1">
                                        {t("label_message")}
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("placeholder_message")}
                                        className={`${inputClass} h-full min-h-37.5 resize-none`}
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full mt-8 relative px-6 py-4 rounded-xl bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 ${
                                        isSubmitting
                                            ? "opacity-70 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            {t("btn_send")} <Send size={20} />
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

export default ContactPage;
