"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import Category from "@/models/Category";
import { auth } from "@/auth";
import slugify from "slugify";
import { IActionResponse, IPlainCategory } from "@/types/backend";
import { requireAdmin } from "@/lib/auth-guards";

export async function getCategories(
    type?: "post" | "project" | "template" | "study"
): Promise<IActionResponse<IPlainCategory[]>> {
    try {
        await connectDB();
        const query: any = {};
        if (type) {
            query.type = type;
        }

        const categories = await Category.find(query)
            .populate("parent", "name")
            .sort({ createdAt: -1 })
            .lean();

        const serialized: IPlainCategory[] = categories.map((cat: any) => ({
            ...cat,
            _id: cat._id.toString(),
            type: cat.type || "post",
            parent: cat.parent
                ? { ...cat.parent, _id: cat.parent._id.toString() }
                : null,
            ancestors: cat.ancestors.map((id: any) => id.toString()),
            createdAt: cat.createdAt.toString(),
            updatedAt: cat.updatedAt.toString(),
            children: [],
        }));

        return { success: true, data: serialized };
    } catch (error) {
        return { success: false, error: "Lỗi lấy danh mục", data: [] };
    }
}

export async function createCategory(formData: FormData) {
    try {
        await requireAdmin();
        await connectDB();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const parentId = formData.get("parent") as string;
        const status = formData.get("status") as string;

        const type = (formData.get("type") as string) || "post";

        if (!name) return { error: "Tên danh mục là bắt buộc" };

        let slug = slugify(name, { lower: true, strict: true, locale: "vi" });

        const exists = await Category.findOne({ slug });
        if (exists) slug = `${slug}-${Date.now()}`;

        let ancestors: string[] = [];
        let depth = 0;

        if (parentId && parentId !== "root") {
            const parentCat = await Category.findById(parentId);
            if (parentCat) {
                ancestors = [...parentCat.ancestors, parentCat._id];
                depth = parentCat.depth + 1;
            }
        }

        const newCategory = new Category({
            name,
            slug,
            description,
            type,
            status: status || "active",
            parent: parentId && parentId !== "root" ? parentId : null,
            ancestors,
            depth,
        });

        await newCategory.save();

        revalidatePath("/admin/categories");
        return { success: true, message: "Tạo danh mục thành công!" };
    } catch (error) {
        console.error("Create category error:", error);
        return { error: "Lỗi khi tạo danh mục" };
    }
}

export async function updateCategory(formData: FormData) {
    try {
        await requireAdmin();

        await connectDB();

        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const parentId = formData.get("parent") as string;
        const status = formData.get("status") as string;

        const type = formData.get("type") as string;

        if (!id || !name) return { error: "Thiếu thông tin bắt buộc" };

        if (parentId === id) {
            return { error: "Không thể chọn chính danh mục này làm cha." };
        }

        let ancestors: string[] = [];
        let depth = 0;

        if (parentId && parentId !== "root") {
            const parentCat = await Category.findById(parentId);
            if (parentCat) {
                ancestors = [...parentCat.ancestors, parentCat._id];
                depth = parentCat.depth + 1;
            }
        }

        await Category.findByIdAndUpdate(id, {
            name,
            description,
            status,
            type,
            parent: parentId && parentId !== "root" ? parentId : null,
            ancestors,
            depth,
        });

        revalidatePath("/admin/categories");
        return { success: true, message: "Cập nhật thành công!" };
    } catch (error) {
        console.error("Update category error:", error);
        return { error: "Lỗi khi cập nhật danh mục" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await requireAdmin();
        await connectDB();

        const hasChildren = await Category.findOne({ parent: id });
        if (hasChildren) {
            return {
                error: "Không thể xóa danh mục này vì nó đang chứa danh mục con.",
            };
        }

        await Category.findByIdAndDelete(id);
        revalidatePath("/admin/categories");
        return { success: true, message: "Đã xóa danh mục." };
    } catch (error) {
        return { error: "Lỗi khi xóa danh mục." };
    }
}
