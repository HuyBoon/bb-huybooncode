"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { Edit, Trash2, Search, Plus, Eye } from "lucide-react";
import { deletePost } from "@/actions/post-actions";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IPagination, IPlainPost } from "@/types/backend";

interface PostListProps {
    data: IPlainPost[];
    pagination: IPagination;
}

export function PostList({ data, pagination }: PostListProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(
        searchParams.get("query") || ""
    );

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams);
        if (term) params.set("query", term);
        else params.delete("query");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        startTransition(async () => {
            const res = await deletePost(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm bài viết..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                <Button asChild>
                    <Link href="/admin/posts/create">
                        <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Ảnh</TableHead>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    Chưa có bài viết nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((post) => (
                                <TableRow key={post._id}>
                                    <TableCell>
                                        <div className="relative h-10 w-16 rounded overflow-hidden bg-muted">
                                            {post.thumbnail?.imgUrl && (
                                                <Image
                                                    src={post.thumbnail.imgUrl}
                                                    alt="Thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium truncate max-w-62.5">
                                            {post.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate max-w-62.5">
                                            /{post.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {post.category?.name || "N/A"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                post.status === "published"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {post.status === "published"
                                                ? "Công khai"
                                                : "Nháp"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(
                                            new Date(post.createdAt),
                                            "dd/MM/yyyy",
                                            { locale: vi }
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {/* NÚT PREVIEW MỚI */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/posts/preview/${post._id}`}
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/admin/posts/edit/${post._id}`}
                                            >
                                                <Edit size={16} />
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                                handleDelete(post._id)
                                            }
                                            disabled={isPending}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination UI logic here (Same as previous) */}
            {pagination.totalPages >= 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                    >
                        Trước
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Trang {pagination.page} / {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                    >
                        Sau
                    </Button>
                </div>
            )}
        </div>
    );
}
