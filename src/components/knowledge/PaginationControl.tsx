"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
}

export default function PaginationControl({
    currentPage,
    totalPages,
}: PaginationControlProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Hàm tạo URL cho trang mới (giữ nguyên query và category)
    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    // Logic để hiển thị số trang (VD: 1 ... 4 5 6 ... 10)
    const generatePagination = () => {
        // Nếu ít hơn 7 trang, hiện tất cả
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Nếu đang ở gần đầu (Trang 1, 2, 3)
        if (currentPage <= 3) {
            return [1, 2, 3, "...", totalPages - 1, totalPages];
        }

        // Nếu đang ở gần cuối
        if (currentPage >= totalPages - 2) {
            return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
        }

        // Nếu đang ở giữa
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
        <div className="flex items-center justify-center space-x-2 mt-10">
            {/* Nút Previous */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
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

            {/* Danh sách số trang */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <div
                                key={`ellipsis-${index}`}
                                className="flex h-9 w-9 items-center justify-center"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
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
                                "h-9 w-9",
                                isCurrent && "pointer-events-none"
                            )}
                            asChild={!isCurrent}
                        >
                            {isCurrent ? (
                                page
                            ) : (
                                <Link href={createPageURL(page)}>{page}</Link>
                            )}
                        </Button>
                    );
                })}
            </div>

            {/* Nút Next */}
            <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
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
    );
}
