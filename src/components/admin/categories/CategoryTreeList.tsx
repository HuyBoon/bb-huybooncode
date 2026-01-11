"use client";

import { useState, useTransition, useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
    Trash2,
    Edit,
    ChevronRight,
    ChevronDown,
    Plus,
    FolderTree,
} from "lucide-react";
import { deleteCategory } from "@/actions/category-actions";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CategoryForm } from "./CategoryForm";

// Helper chuyển Flat Array -> Tree Array
function buildTree(items: any[]) {
    const rootItems: any[] = [];
    const lookup: Record<string, any> = {};

    // Khởi tạo lookup
    for (const item of items) {
        lookup[item._id] = { ...item, children: [] };
    }

    // Xếp con vào cha
    for (const item of items) {
        if (item.parent?._id) {
            lookup[item.parent._id]?.children.push(lookup[item._id]);
        } else {
            rootItems.push(lookup[item._id]);
        }
    }
    return rootItems;
}

export function CategoryTreeList({ data }: { data: any[] }) {
    const [isPending, startTransition] = useTransition();

    // State cho Form
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    // State quản lý việc đóng/mở thư mục (Lưu danh sách ID đang mở)
    // Mặc định mở hết hoặc đóng hết tùy ý. Ở đây mình để mặc định đóng hết cho gọn.
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Chuyển dữ liệu phẳng thành cây
    const treeData = useMemo(() => buildTree(data), [data]);

    // Hành động xóa
    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        startTransition(async () => {
            const res = await deleteCategory(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    // Hành động sửa
    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsSheetOpen(true);
    };

    // Hành động tạo mới
    const handleCreate = () => {
        setEditingCategory(null);
        setIsSheetOpen(true);
    };

    // --- COMPONENT ĐỆ QUY ĐỂ RENDER TỪNG DÒNG ---
    const CategoryRow = ({
        node,
        level = 0,
    }: {
        node: any;
        level?: number;
    }) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedIds[node._id];

        return (
            <div className="flex flex-col">
                {/* Dòng hiển thị Category */}
                <div
                    className={cn(
                        "flex items-center justify-between p-3 border-b hover:bg-muted/50 transition-colors",
                        level === 0 && "bg-muted/10 font-medium" // Highlight nhẹ cấp cha
                    )}
                    style={{ paddingLeft: `${level * 24 + 12}px` }} // Thụt đầu dòng
                >
                    <div className="flex items-center gap-2">
                        {/* Nút Toggle */}
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(node._id)}
                                className="p-1 hover:bg-muted rounded-sm text-muted-foreground"
                            >
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        ) : (
                            <span className="w-6" /> // Placeholder để thẳng hàng
                        )}

                        <span className="truncate max-w-50 sm:max-w-md">
                            {node.name}
                        </span>
                        {node.status === "inactive" && (
                            <Badge
                                variant="secondary"
                                className="ml-2 text-[10px] h-5"
                            >
                                Ẩn
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="hidden sm:inline-block">
                            {format(new Date(node.createdAt), "dd/MM/yyyy", {
                                locale: vi,
                            })}
                        </span>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEdit(node)}
                            >
                                <Edit size={14} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(node._id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="border-l border-muted ml-5.5">
                        {" "}
                        {node.children.map((child: any) => (
                            <CategoryRow
                                key={child._id}
                                node={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="mb-4 flex justify-end">
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                {/* Header giả lập bảng */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div className="pl-9">Tên danh mục</div>
                    <div className="pr-12">Hành động</div>
                </div>

                {/* Body */}
                {treeData.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                        <FolderTree className="h-10 w-10 mb-2 opacity-20" />
                        Chưa có danh mục nào.
                    </div>
                ) : (
                    treeData.map((node) => (
                        <CategoryRow key={node._id} node={node} />
                    ))
                )}
            </div>

            {/* Form Sheet (Dùng chung cho cả Create và Edit) */}
            <CategoryForm
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                existingCategories={data} // Vẫn truyền list phẳng để làm dropdown chọn cha
                editingCategory={editingCategory}
            />
        </>
    );
}
