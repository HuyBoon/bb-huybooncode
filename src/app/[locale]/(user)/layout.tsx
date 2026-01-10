import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/user/UserSidebar";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/user/UserNav";
import { ThemeButtons } from "@/components/ui/ThemeButtons";

export default async function UserLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth();

    if (!session) redirect("/login");

    return (
        <SidebarProvider>
            <UserSidebar />
            <SidebarInset>
                {/* --- HEADER --- */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
                    {/* Left Side: Trigger & Breadcrumb Title */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <h2 className="text-sm font-semibold tracking-tight">
                            Bảng điều khiển
                        </h2>
                    </div>

                    {/* Right Side: Theme & User Nav */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center px-2">
                            <ThemeButtons />
                        </div>
                        {/* Truyền user data xuống client component */}
                        <UserNav user={session.user} />
                    </div>
                </header>

                {/* --- MAIN CONTENT --- */}
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-muted/20 min-h-[calc(100vh-4rem)]">
                    <div className="max-w-6xl mx-auto w-full animate-in fade-in-50 duration-500">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
