"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen w-full">
            <aside className="hidden md:block fixed inset-y-0 z-40 bg-background transition-all duration-300 ease-in-out">
                <AdminSidebar />
            </aside>

            <div
                className={cn(
                    "flex flex-col w-full transition-all duration-300 ease-in-out",

                    isCollapsed ? "md:pl-20" : "md:pl-64"
                )}
            >
                {children}
            </div>
        </div>
    );
}
