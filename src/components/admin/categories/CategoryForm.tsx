"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { createCategory, updateCategory } from "@/actions/category-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    existingCategories: any[];
    editingCategory?: any | null; // Dữ liệu danh mục đang sửa (nếu có)
}

export function CategoryForm({
    open,
    onOpenChange,
    existingCategories,
    editingCategory,
}: CategoryFormProps) {
    const [isPending, startTransition] = useTransition();

    const isEditMode = !!editingCategory;

    const handleSubmit = (formData: FormData) => {
        if (isEditMode) {
            formData.append("id", editingCategory._id);
        }

        startTransition(async () => {
            const action = isEditMode ? updateCategory : createCategory;
            const result = await action(formData);

            if (result.success) {
                toast.success(result.message);
                onOpenChange(false); // Đóng form
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md overflow-y-auto px-4">
                <SheetHeader>
                    <SheetTitle>
                        {isEditMode ? "Cập nhật danh mục" : "Tạo danh mục mới"}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditMode
                            ? "Chỉnh sửa thông tin danh mục."
                            : "Điền thông tin danh mục mới."}
                    </SheetDescription>
                </SheetHeader>

                <form action={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên danh mục <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Ví dụ: Lập trình Web"
                            defaultValue={editingCategory?.name}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parent">Danh mục cha</Label>
                        <Select
                            name="parent"
                            // Nếu đang edit thì lấy parent._id, nếu không có parent thì là root
                            defaultValue={
                                editingCategory?.parent?._id || "root"
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục cha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="root">
                                    -- Là danh mục gốc --
                                </SelectItem>
                                {existingCategories.map((cat) => (
                                    // Không cho phép chọn chính nó làm cha khi đang edit
                                    <SelectItem
                                        key={cat._id}
                                        value={cat._id}
                                        disabled={
                                            isEditMode &&
                                            cat._id === editingCategory._id
                                        }
                                    >
                                        {/* Hiển thị phân cấp */}
                                        {Array(cat.depth)
                                            .fill("— ")
                                            .join("")}{" "}
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Mô tả ngắn..."
                            defaultValue={editingCategory?.description}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                            name="status"
                            defaultValue={editingCategory?.status || "active"}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">
                                    Hoạt động
                                </SelectItem>
                                <SelectItem value="inactive">Ẩn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            ) : null}
                            {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
