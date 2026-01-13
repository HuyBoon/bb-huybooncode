"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";

interface MobilePostSidebarProps {
    children: ReactNode;
}

export function MobilePostSidebar({ children }: MobilePostSidebarProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 lg:hidden flex h-10 w-10 items-center justify-center cursor-pointer group">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75 duration-1000"></span>

                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-primary/10"></span>

                    <Button
                        size="icon"
                        className="relative h-8 w-8 rounded-full shadow-2xl border-2 border-primary/20 bg-background/90 backdrop-blur-md text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
                        title="Mục lục & Danh mục"
                    >
                        <BookOpen className="h-5 w-5 group-hover:animate-pulse" />
                    </Button>
                </div>
            </SheetTrigger>

            <SheetContent side="right" className="w-75 sm:w-87.5 p-0">
                <SheetHeader className="p-4 border-b bg-muted/30">
                    <SheetTitle>Mục lục & Danh mục</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-60px)] p-4">
                    <div className="space-y-8 pb-10">{children}</div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
