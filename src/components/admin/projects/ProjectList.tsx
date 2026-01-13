"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Edit,
    Trash2,
    Star,
    Eye, // 👈 Import icon Eye
} from "lucide-react";
import { toast } from "sonner";
import { deleteProject } from "@/actions/project-actions";

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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"; // Thêm Tooltip cho chuyên nghiệp

import { IPlainProject, IPagination } from "@/types/backend";
import { AdminPagination } from "../AdminPagination";

export function ProjectList({
    data,
    pagination,
}: {
    data: IPlainProject[];
    pagination: IPagination;
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Xóa dự án này? Hành động không thể hoàn tác.")) return;
        startTransition(async () => {
            const res = await deleteProject(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20 pl-4">Ảnh</TableHead>
                            <TableHead>Tên dự án</TableHead>
                            <TableHead className="hidden md:table-cell">
                                Danh mục
                            </TableHead>
                            <TableHead className="hidden lg:table-cell">
                                Công nghệ
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
                                    Không tìm thấy dự án nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((project) => (
                                <TableRow key={project._id} className="group">
                                    {/* Cột 1: Ảnh Thumbnail */}
                                    <TableCell className="pl-4">
                                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border shadow-sm">
                                            {project.thumbnail?.imgUrl ? (
                                                <Image
                                                    src={
                                                        project.thumbnail.imgUrl
                                                    }
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Cột 2: Thông tin chính */}
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold flex items-center gap-1.5 text-foreground">
                                                {project.title}
                                                {project.isFeatured && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Star
                                                                    size={12}
                                                                    className="text-yellow-500 fill-yellow-500"
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Dự án nổi bật
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {project.client ||
                                                    "Personal Project"}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Cột 3: Danh mục */}
                                    <TableCell className="hidden md:table-cell">
                                        {project.category ? (
                                            <Badge
                                                variant="outline"
                                                className="font-normal"
                                            >
                                                {project.category.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">
                                                -
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* Cột 4: Tech Stack */}
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1 max-w-50">
                                            {project.techStack
                                                .slice(0, 3)
                                                .map((tech, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="text-[10px] px-1.5 h-5 font-normal"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            {project.techStack.length > 3 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 h-5 font-normal"
                                                >
                                                    +
                                                    {project.techStack.length -
                                                        3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {/* Cột 5: Trạng thái */}
                                    <TableCell>
                                        <Badge
                                            variant={
                                                project.status === "completed"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className={
                                                project.status === "completed"
                                                    ? "bg-green-600 hover:bg-green-700"
                                                    : ""
                                            }
                                        >
                                            {project.status === "completed"
                                                ? "Hoàn thành"
                                                : "Đang làm"}
                                        </Badge>
                                    </TableCell>

                                    {/* Cột 6: Hành động */}
                                    <TableCell className="text-right pr-4">
                                        <div className="flex justify-end items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {/* Nút Xem (Preview) */}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/projects/preview/${project._id}`}
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Xem chi tiết
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {/* Nút Sửa */}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-muted"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/projects/${project._id}`}
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Chỉnh sửa
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {/* Nút Xóa */}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    project._id
                                                                )
                                                            }
                                                            disabled={isPending}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Xóa dự án
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 👇 Thêm Pagination vào đây */}
            {pagination.totalPages >= 1 && (
                <AdminPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                />
            )}
        </div>
    );
}
