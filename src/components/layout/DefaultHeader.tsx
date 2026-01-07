"use client";

import { useTranslations } from "next-intl";
import BaseHeader from "./BaseHeader";

const DefaultHeader = () => {
    const t = useTranslations("Navigation");

    const navItems = [
        { href: "/services", label: t("services") },
        { href: "/projects", label: t("projects") },
        { href: "/portfolio", label: t("portfolio") },
        // { href: "/blog", label: t("blog") },
        { href: "/contact", label: t("contact") },
    ];

    return <BaseHeader navItems={navItems} />;
};

export default DefaultHeader;
