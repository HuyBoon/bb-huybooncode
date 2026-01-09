"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    FileText,
    Package,
    PieChart,
    LogOut,
    Briefcase,
    Mail,
    Infinity,
    ShoppingCart,
    Tag,
    FolderKanban,
    Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { handleSignOut } from "@/actions/auth-actions";
import { useSidebar } from "./SidebarContext";

// Data
const sidebarGroups = [
    {
        group: "Overview",
        items: [
            { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
            { icon: PieChart, label: "Analytics", href: "/admin/analytics" },
        ],
    },
    {
        group: "Commerce",
        items: [
            { icon: Package, label: "Templates", href: "/admin/templates" },
            { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
            { icon: Tag, label: "Coupons", href: "/admin/coupons" },
        ],
    },
    {
        group: "Content",
        items: [
            { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
            { icon: FileText, label: "Posts", href: "/admin/post" },
            { icon: Briefcase, label: "Experience", href: "/admin/experience" },
        ],
    },
    {
        group: "Relationship",
        items: [
            { icon: Users2, label: "Customers", href: "/admin/customers" },
            { icon: Mail, label: "Messages", href: "/admin/messages" },
        ],
    },
    {
        group: "System",
        items: [{ icon: Settings, label: "Settings", href: "/admin/settings" }],
    },
];

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const { isCollapsed } = useSidebar();

    // Component nút Logout để tái sử dụng trong Tooltip
    const LogoutButton = (
        <Button
            variant="ghost"
            className={cn(
                "transition-all duration-300 group hover:bg-destructive/10 hover:text-destructive text-muted-foreground",
                isCollapsed
                    ? "h-11 w-11 mx-auto justify-center p-0 rounded-md" // Collapsed: Hình vuông căn giữa
                    : "w-full justify-start gap-3 px-3" // Expanded: Full width
            )}
        >
            <LogOut size={18} className="shrink-0" />
            <span
                className={cn(
                    "text-[13px] font-medium transition-all duration-300 whitespace-nowrap overflow-hidden",
                    isCollapsed
                        ? "w-0 opacity-0 absolute"
                        : "w-auto opacity-100 relative"
                )}
            >
                Đăng xuất
            </span>
        </Button>
    );

    return (
        <TooltipProvider delayDuration={0}>
            {/* FIX SCROLL: 
               1. h-screen sticky top-0: Cố định chiều cao bằng màn hình
               2. overflow-hidden: Bắt buộc để con (ScrollArea) cuộn được
            */}
            <div
                className={cn(
                    "sticky top-0 h-screen flex flex-col border-r bg-background transition-[width] duration-300 ease-in-out overflow-hidden",
                    isCollapsed ? "w-20" : "w-64",
                    className
                )}
            >
                {/* --- HEADER --- */}
                <div className="relative flex h-20 shrink-0 items-center justify-center overflow-hidden border-b">
                    <Link
                        href="/admin"
                        className="flex items-center justify-center w-full h-full relative"
                    >
                        <div
                            className={cn(
                                "absolute transition-all duration-300 ease-in-out flex items-center justify-center text-primary",
                                isCollapsed
                                    ? "opacity-100 scale-100 rotate-0"
                                    : "opacity-0 scale-50 -rotate-90 pointer-events-none"
                            )}
                        >
                            <Infinity size={28} />
                        </div>

                        <div
                            className={cn(
                                "absolute transition-all duration-300 ease-in-out flex items-center gap-1.5 font-bold text-lg tracking-tighter whitespace-nowrap",
                                isCollapsed
                                    ? "opacity-0 scale-90 translate-y-2 pointer-events-none"
                                    : "opacity-100 scale-100 translate-y-0"
                            )}
                        >
                            <span className="text-primary text-xl">&lt;</span>
                            <span>HB Admin</span>
                            <span className="text-primary text-xl">/&gt;</span>
                        </div>
                    </Link>
                </div>

                {/* --- SCROLL AREA --- */}
                {/* flex-1 để chiếm toàn bộ khoảng trống còn lại */}
                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col gap-6 py-4">
                        {sidebarGroups.map((group, idx) => (
                            <div
                                key={idx}
                                className={cn("px-3", isCollapsed && "px-0")}
                            >
                                <div
                                    className={cn(
                                        "mb-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                                        isCollapsed
                                            ? "h-0 opacity-0 mb-0"
                                            : "h-auto opacity-100 px-2"
                                    )}
                                >
                                    <h4 className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                                        {group.group}
                                    </h4>
                                </div>

                                <div
                                    className={cn(
                                        "space-y-1",
                                        !isCollapsed && "ml-1"
                                    )}
                                >
                                    {group.items.map((item) => {
                                        const isActive = pathname === item.href;

                                        const NavItem = (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md transition-all duration-300 relative group overflow-hidden whitespace-nowrap",
                                                    isCollapsed
                                                        ? "justify-center w-11 h-11 mx-auto p-0"
                                                        : "px-3 py-2 w-full",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <item.icon
                                                    size={18}
                                                    className={cn(
                                                        "shrink-0 transition-transform duration-300",
                                                        !isActive &&
                                                            "group-hover:scale-110"
                                                    )}
                                                />

                                                <span
                                                    className={cn(
                                                        "text-[13px] transition-all duration-300",
                                                        isCollapsed
                                                            ? "w-0 opacity-0 translate-x-4 absolute"
                                                            : "w-auto opacity-100 translate-x-0 relative"
                                                    )}
                                                >
                                                    {item.label}
                                                </span>

                                                {isActive && !isCollapsed && (
                                                    <div className="absolute left-0 h-4 w-1 rounded-r-full bg-primary" />
                                                )}
                                            </Link>
                                        );

                                        return isCollapsed ? (
                                            <Tooltip key={item.href}>
                                                <TooltipTrigger asChild>
                                                    {NavItem}
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    className="font-medium text-xs"
                                                    sideOffset={5}
                                                >
                                                    {item.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <div key={item.href}>{NavItem}</div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* --- FOOTER --- */}
                {/* shrink-0: Quan trọng! Giữ footer không bị co lại khi scroll area dài ra */}
                <div className="p-3 border-t bg-background shrink-0">
                    <form action={handleSignOut} className="w-full">
                        {isCollapsed ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {LogoutButton}
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="font-medium text-xs"
                                    sideOffset={5}
                                >
                                    Đăng xuất
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            LogoutButton
                        )}
                    </form>
                </div>
            </div>
        </TooltipProvider>
    );
}
