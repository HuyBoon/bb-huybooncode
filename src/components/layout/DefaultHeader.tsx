"use client";

import { useTranslations } from "next-intl";
import BaseHeader from "./BaseHeader";
import { Session } from "next-auth";

const DefaultHeader = ({ session }: { session: Session | null }) => {
    const t = useTranslations("Navigation");

    const navItems = [
        { href: "/services", label: t("services") },
        { href: "/projects", label: t("projects") },
        { href: "/portfolio", label: t("portfolio") },
        // { href: "/blog", label: t("blog") },
        // { href: "/knowledge", label: t("knowledge") },
        { href: "/contact", label: t("contact") },
    ];

    return <BaseHeader navItems={navItems} session={session} />;
};

export default DefaultHeader;
