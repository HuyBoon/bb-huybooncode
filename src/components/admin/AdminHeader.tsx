"use client";

import { Menu, Search, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeButtons } from "@/components/ui/ThemeButtons";
import { AdminSidebar } from "./AdminSidebar";
import { Session } from "next-auth";
import { handleSignOut } from "@/actions/auth-actions";
import { useSidebar } from "./SidebarContext";

export function AdminHeader({ user }: { user: Session["user"] }) {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetTitle className="sr-only">Nav</SheetTitle>

                    <AdminSidebar className="w-full border-none" />
                </SheetContent>
            </Sheet>

            {/* --- 2. Desktop Sidebar Toggle (MỚI) --- */}
            <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-muted-foreground"
                onClick={toggleSidebar}
            >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>

            {/* Breadcrumb / Search */}
            <div className="w-full flex-1">
                {/* ... (Giữ nguyên phần Search) ... */}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* ... (Giữ nguyên phần User/Theme) ... */}
                <ThemeButtons />
                <DropdownMenu>
                    {/* ... (Giữ nguyên User Menu) ... */}
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage
                                    src={user?.image || ""}
                                    alt={user?.name || ""}
                                />
                                <AvatarFallback>HB</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.name}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleSignOut()}
                        >
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
