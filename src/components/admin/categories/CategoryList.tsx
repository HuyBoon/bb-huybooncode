"use client";

import { useTransition } from "react";
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

export function CategoryList({ data }: { data: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;

        startTransition(async () => {
            const res = await deleteCategory(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Danh mục cha</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="text-center h-24 text-muted-foreground"
                            >
                                Chưa có danh mục nào.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell className="font-medium">
                                    {/* Hiển thị thụt đầu dòng để dễ nhìn cấu trúc cây */}
                                    <span className="text-muted-foreground mr-1">
                                        {Array(cat.depth).fill("└── ").join("")}
                                    </span>
                                    {cat.name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {cat.slug}
                                </TableCell>
                                <TableCell>
                                    {cat.parent ? (
                                        <Badge variant="outline">
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
                                <TableCell>
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
                                        disabled
                                    >
                                        <Edit size={16} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(cat._id)}
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
    );
}
