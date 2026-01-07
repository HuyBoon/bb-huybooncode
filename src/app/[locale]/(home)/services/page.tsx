"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
    Rocket,
    Building2,
    UserCircle,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
    const t = useTranslations("Services");

    const serviceData = [
        {
            key: "landing_page",
            icon: <Rocket className="w-8 h-8" />,
            color: "from-blue-500 to-cyan-400",
        },
        {
            key: "business",
            icon: <Building2 className="w-8 h-8" />,
            color: "from-emerald-500 to-teal-400",
        },
        {
            key: "personal",
            icon: <UserCircle className="w-8 h-8" />,
            color: "from-orange-500 to-yellow-400",
        },
    ];

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-12 xl:px-24">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        {t("title_1")}{" "}
                        <span className="text-primary">{t("title_2")}</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t("subtitle")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {serviceData.map((service, index) => (
                        <motion.div
                            key={service.key}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm"
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl bg-linear-to-br ${service.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/10`}
                            >
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                                {t(`packages.${service.key}.title`)}
                            </h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                {t(`packages.${service.key}.desc`)}
                            </p>

                            <ul className="space-y-3 mb-10">
                                {t
                                    .raw(`packages.${service.key}.features`)
                                    .map((feature: string, i: number) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3 text-sm font-medium"
                                        >
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                            </ul>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 font-bold text-primary group-hover:translate-x-2 transition-transform"
                            >
                                {t("cta")} <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
