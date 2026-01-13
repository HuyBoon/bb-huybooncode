"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";
import { deleteCategory } from "@/actions/category-actions";

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
import { CategoryForm } from "./CategoryForm"; // Import Form

// Helper hiển thị badge loại
const getTypeBadge = (type: string) => {
    switch (type) {
        case "project":
            return (
                <Badge
                    variant="outline"
                    className="border-purple-200 text-purple-700 bg-purple-50"
                >
                    Project
                </Badge>
            );
        case "template":
            return (
                <Badge
                    variant="outline"
                    className="border-orange-200 text-orange-700 bg-orange-50"
                >
                    Template
                </Badge>
            );
        case "post":
        default:
            return (
                <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50"
                >
                    Blog
                </Badge>
            );
    }
};

export function CategoryList({ data }: { data: any[] }) {
    const [isPending, startTransition] = useTransition();

    // State cho Form Edit
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

        startTransition(async () => {
            const res = await deleteCategory(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsSheetOpen(true);
    };

    return (
        <>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead>Loại</TableHead> {/* Thêm cột Loại */}
                            <TableHead>Slug</TableHead>
                            <TableHead>Danh mục cha</TableHead>
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
                                    colSpan={7}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    Chưa có danh mục nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((cat) => (
                                <TableRow key={cat._id}>
                                    <TableCell className="font-medium">
                                        <span className="text-muted-foreground/40 mr-1 font-mono">
                                            {Array(cat.depth)
                                                .fill("└─ ")
                                                .join("")}
                                        </span>
                                        {cat.name}
                                    </TableCell>

                                    {/* Hiển thị Loại */}
                                    <TableCell>
                                        {getTypeBadge(cat.type)}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground text-xs">
                                        {cat.slug}
                                    </TableCell>

                                    <TableCell>
                                        {cat.parent ? (
                                            <Badge
                                                variant="secondary"
                                                className="font-normal"
                                            >
                                                {cat.parent.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Gốc
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                cat.status === "active"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {cat.status === "active"
                                                ? "Hiện"
                                                : "Ẩn"}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(
                                            new Date(cat.createdAt),
                                            "dd/MM/yyyy",
                                            { locale: vi }
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => handleEdit(cat)} // Đã kích hoạt Edit
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10"
                                            onClick={() =>
                                                handleDelete(cat._id)
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

            {/* Form Edit */}
            <CategoryForm
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                existingCategories={data}
                editingCategory={editingCategory}
            />
        </>
    );
}
