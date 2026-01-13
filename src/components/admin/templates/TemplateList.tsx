"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { deleteTemplate } from "@/actions/template-actions";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IPlainWebTemplate, IPagination } from "@/types/backend";
import { AdminPagination } from "@/components/admin/AdminPagination";

export function TemplateList({
    data,
    pagination,
}: {
    data: IPlainWebTemplate[];
    pagination: IPagination;
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Xóa giao diện này?")) return;
        startTransition(async () => {
            const res = await deleteTemplate(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    const formatPrice = (price: number, isFree: boolean) => {
        if (isFree)
            return (
                <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                >
                    Miễn phí
                </Badge>
            );
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20 pl-4">Ảnh</TableHead>
                            <TableHead>Tên giao diện</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Danh mục
                            </TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right pr-4">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center h-32 text-muted-foreground"
                                >
                                    Chưa có giao diện nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item._id} className="group">
                                    <TableCell className="pl-4">
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                                            {item.thumbnail?.imgUrl && (
                                                <Image
                                                    src={item.thumbnail.imgUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold">
                                                {item.name}
                                            </span>
                                            {item.previewUrl && (
                                                <a
                                                    href={item.previewUrl}
                                                    target="_blank"
                                                    className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                                >
                                                    Xem Demo{" "}
                                                    <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {formatPrice(item.price, item.isFree)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {item.category ? (
                                            <Badge variant="outline">
                                                {item.category.name}
                                            </Badge>
                                        ) : (
                                            "-"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                item.status === "available"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {item.status === "available"
                                                ? "Sẵn sàng"
                                                : "Sắp ra mắt"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                className="h-8 w-8 hover:bg-muted"
                                            >
                                                <Link
                                                    href={`/admin/templates/${item._id}`}
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                                disabled={isPending}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination.totalPages > 1 && (
                <AdminPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}
