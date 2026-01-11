"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import Category from "@/models/Category";
import { auth } from "@/auth";
import slugify from "slugify";

export async function getCategories() {
    try {
        await connectDB();

        const categories = await Category.find({})
            .populate("parent", "name")
            .sort({ createdAt: -1 })
            .lean();

        const serialized = categories.map((cat: any) => ({
            ...cat,
            _id: cat._id.toString(),
            parent: cat.parent
                ? { ...cat.parent, _id: cat.parent._id.toString() }
                : null,
            ancestors: cat.ancestors.map((id: any) => id.toString()),
            createdAt: cat.createdAt.toString(),
            updatedAt: cat.updatedAt.toString(),
        }));

        return { success: true, data: serialized };
    } catch (error) {
        console.error("Get categories error:", error);
        return { success: false, error: "Lỗi lấy danh mục" };
    }
}

// 2. Tạo Category mới
export async function createCategory(formData: FormData) {
    try {
        const session = await auth();
        // if (session?.user?.role !== "admin") return { error: "Unauthorized" };

        await connectDB();

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const parentId = formData.get("parent") as string; // ID của cha (nếu có)
        const status = formData.get("status") as string;

        if (!name) return { error: "Tên danh mục là bắt buộc" };

        // Tạo Slug
        let slug = slugify(name, { lower: true, strict: true, locale: "vi" });

        // Check trùng slug
        const exists = await Category.findOne({ slug });
        if (exists) slug = `${slug}-${Date.now()}`;

        // Logic tính toán Cây phân cấp (Hierarchy)
        let ancestors: string[] = [];
        let depth = 0;

        if (parentId && parentId !== "root") {
            const parentCat = await Category.findById(parentId);
            if (parentCat) {
                // Ancestors của con = Ancestors của cha + ID của cha
                ancestors = [...parentCat.ancestors, parentCat._id];
                depth = parentCat.depth + 1;
            }
        }

        const newCategory = new Category({
            name,
            slug,
            description,
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
// ... (Các hàm cũ giữ nguyên)

// 4. Cập nhật Category
export async function updateCategory(formData: FormData) {
    try {
        const session = await auth();
        // Check quyền admin...

        await connectDB();

        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const parentId = formData.get("parent") as string;
        const status = formData.get("status") as string;

        if (!id || !name) return { error: "Thiếu thông tin bắt buộc" };

        // Logic check: Không được chọn chính nó làm cha
        if (parentId === id) {
            return { error: "Không thể chọn chính danh mục này làm cha." };
        }

        // Cập nhật lại Slug (nếu muốn đổi tên thì đổi slug luôn, hoặc giữ nguyên tùy business)
        // Ở đây mình giữ slug cũ để tránh hỏng link SEO, chỉ update các info khác
        // Nếu muốn update slug thì dùng slugify lại.

        // Tính toán lại ancestors và depth nếu đổi cha
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

// 3. Xóa Category
export async function deleteCategory(id: string) {
    try {
        await connectDB();

        // Kiểm tra xem có danh mục con không?
        const hasChildren = await Category.findOne({ parent: id });
        if (hasChildren) {
            return {
                error: "Không thể xóa danh mục này vì nó đang chứa danh mục con.",
            };
        }

        // Kiểm tra xem có bài viết nào dùng danh mục này không? (Optional)
        // const hasBlogs = await Blog.findOne({ category: id });
        // if (hasBlogs) return { error: "Danh mục đang có bài viết, không thể xóa." };

        await Category.findByIdAndDelete(id);
        revalidatePath("/admin/categories");
        return { success: true, message: "Đã xóa danh mục." };
    } catch (error) {
        return { error: "Lỗi khi xóa danh mục." };
    }
}
