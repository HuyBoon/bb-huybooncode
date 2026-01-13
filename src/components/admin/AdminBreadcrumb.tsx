"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { Slash } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_MAPPING: Record<string, string> = {
    admin: "Quản trị",
    dashboard: "Tổng quan",
    categories: "Danh mục",
    blogs: "Bài viết",
    create: "Tạo mới",
    edit: "Chỉnh sửa",
    users: "Người dùng",
    customers: "Khách hàng",
    settings: "Cài đặt",
    profile: "Hồ sơ",
    messages: "Tin nhắn",
};

export function AdminBreadcrumb() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter((item) => item !== "");

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    if (segment === "admin") return null;
                    const href = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;
                    const label = ROUTE_MAPPING[segment] || segment;

                    return (
                        <Fragment key={href}>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold text-primary">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
