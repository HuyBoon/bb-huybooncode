"use client";

import { useTransition } from "react";
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
    editingCategory?: any | null;
}

export function CategoryForm({
    open,
    onOpenChange,
    existingCategories,
    editingCategory,
}: CategoryFormProps) {
    const [isPending, startTransition] = useTransition();
    const isEditMode = !!editingCategory?._id;

    const handleSubmit = (formData: FormData) => {
        if (isEditMode) {
            formData.append("id", editingCategory._id);
        }
        if (!isEditMode && editingCategory?.type) {
            formData.append("type", editingCategory.type);
        }

        startTransition(async () => {
            const action = isEditMode ? updateCategory : createCategory;
            const result = await action(formData);

            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
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
                    {/* 1. Tên danh mục */}
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

                    {/* 2. Loại danh mục (MỚI THÊM) */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Loại danh mục</Label>
                        <Select
                            name="type"
                            defaultValue={editingCategory?.type || "post"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="post">
                                    Bài viết (Blog)
                                </SelectItem>
                                <SelectItem value="project">
                                    Dự án (Portfolio)
                                </SelectItem>
                                <SelectItem value="template">
                                    Giao diện (Template)
                                </SelectItem>
                                <SelectItem value="study">
                                    Khóa học (Study)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">
                            Xác định danh mục này dùng cho phần nào của website.
                        </p>
                    </div>

                    {/* 3. Danh mục cha */}
                    <div className="space-y-2">
                        <Label htmlFor="parent">Danh mục cha</Label>
                        <Select
                            name="parent"
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
                                    <SelectItem
                                        key={cat._id}
                                        value={cat._id}
                                        disabled={
                                            isEditMode &&
                                            cat._id === editingCategory._id
                                        }
                                    >
                                        <span className="text-muted-foreground/50 mr-2">
                                            [
                                            {cat.type === "post"
                                                ? "Blog"
                                                : cat.type === "project"
                                                ? "Project"
                                                : cat.type === "template"
                                                ? "Templage"
                                                : "Study"}
                                            ]
                                        </span>
                                        {Array(cat.depth).fill("— ").join("")}{" "}
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 4. Mô tả */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Mô tả ngắn..."
                            defaultValue={editingCategory?.description}
                        />
                    </div>

                    {/* 5. Trạng thái */}
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
