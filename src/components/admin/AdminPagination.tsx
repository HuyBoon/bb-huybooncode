"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
}

export function AdminPagination({
    currentPage,
    totalPages,
}: AdminPaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Hàm tạo URL giữ nguyên các params cũ (search, filter...)
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Logic tạo dãy số trang thông minh
    const generatePagination = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, "...", totalPages - 1, totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
        }
        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    if (totalPages <= 1) return null;

    const pages = generatePagination();

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
                Trang {currentPage} trên {totalPages}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage <= 1}
                    asChild={currentPage > 1}
                >
                    {currentPage <= 1 ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <Link href={createPageURL(currentPage - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    )}
                </Button>

                <div className="flex items-center gap-1">
                    {pages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <div
                                    key={`ellipsis-${index}`}
                                    className="flex h-8 w-8 items-center justify-center text-muted-foreground"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </div>
                            );
                        }

                        const isCurrent = page === currentPage;
                        return (
                            <Button
                                key={page}
                                variant={isCurrent ? "default" : "outline"}
                                size="icon"
                                className={cn(
                                    "h-8 w-8",
                                    isCurrent && "pointer-events-none"
                                )}
                                asChild={!isCurrent}
                            >
                                {isCurrent ? (
                                    page
                                ) : (
                                    <Link href={createPageURL(page)}>
                                        {page}
                                    </Link>
                                )}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    asChild={currentPage < totalPages}
                >
                    {currentPage >= totalPages ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <Link href={createPageURL(currentPage + 1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </Button>
            </div>
        </div>
    );
}
