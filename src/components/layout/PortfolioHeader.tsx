"use client";

import { useTranslations } from "next-intl";
import BaseHeader from "./BaseHeader";
import { Session } from "next-auth";

const PortfolioHeader = ({ session }: { session: Session | null }) => {
    const t = useTranslations("Navigation");

    const navItems = [
        { href: "#about", label: t("about") },
        { href: "#skills", label: t("skills") },
        { href: "#projects", label: t("projects") },
        { href: "#experience", label: t("experience") },
        { href: "#contact", label: t("contact") },
    ];

    return (
        <BaseHeader navItems={navItems} showSocials={true} session={session} />
    );
};

export default PortfolioHeader;
