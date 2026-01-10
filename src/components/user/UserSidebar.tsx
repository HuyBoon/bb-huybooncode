"use client";

import {
    User,
    Heart,
    Settings,
    LayoutDashboard,
    Bell,
    LogOut,
    Infinity,
    Home,
    ChevronRight,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { handleSignOut } from "@/actions/auth-actions";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";

const sidebarItems = [
    { label: "Bảng điều khiển", href: "/dashboard", icon: LayoutDashboard },
    { label: "Thông tin cá nhân", href: "/profile", icon: User },
    { label: "Bài viết đã lưu", href: "/favorites", icon: Heart },
    { label: "Thông báo", href: "/notifications", icon: Bell },
    { label: "Cài đặt", href: "/settings", icon: Settings },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="py-4">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center"
                >
                    {/* Khối Icon: Luôn hiển thị */}
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Infinity className="size-5" />
                    </div>

                    {/* Khối Text: Tự động ẩn khi đóng */}
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="truncate font-bold text-lg">
                            HBTech
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            Dashboard
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Cá nhân</SidebarGroupLabel>
                    <SidebarMenu>
                        {sidebarItems.map((item) => {
                            const isActive = pathname.includes(item.href);
                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        isActive={isActive}
                                        className={cn(
                                            isActive &&
                                                "bg-primary/10 text-primary hover:bg-primary/15"
                                        )}
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-3"
                                        >
                                            <item.icon size={18} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <form action={handleSignOut}>
                            <SidebarMenuButton className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full">
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </SidebarMenuButton>
                        </form>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
