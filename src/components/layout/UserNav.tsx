"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { handleSignOut } from "@/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Heart, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";

interface UserNavProps {
    session: Session | null;
}

export function UserNav({ session }: UserNavProps) {
    const t = useTranslations("Navigation");

    const user = session?.user;

    if (!session) {
        return (
            <Button
                variant="default"
                size="sm"
                asChild
                className="rounded-full px-4 h-9"
            >
                <Link href="/login">{t("login")}</Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-offset-background hover:bg-muted transition-all"
                >
                    <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarImage
                            src={user?.image || ""}
                            alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user?.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-56 mt-2 backdrop-blur-xl bg-background/95 border-border/50"
            >
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {(user?.role === "admin" || user?.role === "superAdmin") && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                            Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Hồ sơ cá nhân
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" /> Bài viết đã lưu
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" /> Cài đặt
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    onClick={() => handleSignOut()}
                >
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
