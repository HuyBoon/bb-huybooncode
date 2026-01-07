"use client";

import { useTranslations } from "next-intl";
import BaseHeader from "./BaseHeader";

const PortfolioHeader = () => {
    const t = useTranslations("Navigation");

    const navItems = [
        { href: "#about", label: t("about") },
        { href: "#skills", label: t("skills") },
        { href: "#projects", label: t("projects") },
        { href: "#experience", label: t("experience") },
        { href: "#contact", label: t("contact") },
    ];

    return <BaseHeader navItems={navItems} showSocials={true} />;
};

export default PortfolioHeader;
