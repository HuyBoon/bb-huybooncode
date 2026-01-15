"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import WebTemplate from "@/models/WebTemplate";
import Category from "@/models/Category";
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
} from "@/actions/image-actions";
import { IActionResponse, IPlainWebTemplate } from "@/types/backend";
import slugify from "slugify";
import { requireAdmin } from "@/lib/auth-guards";

export async function getTemplates(
    page = 1,
    limit = 10,
    search = "",
    categorySlug = ""
): Promise<IActionResponse<IPlainWebTemplate[]>> {
    try {
        await connectDB();
        const _init = Category;

        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }

        if (categorySlug) {
            const category = await Category.findOne({
                slug: categorySlug,
                type: "template",
            });
            if (category) query.category = category._id;
        }

        const templates = await WebTemplate.find(query)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await WebTemplate.countDocuments(query);

        const serializedData: IPlainWebTemplate[] = templates.map((t: any) => ({
            ...t,
            _id: t._id.toString(),
            category: t.category
                ? { ...t.category, _id: t.category._id.toString() }
                : null,
            thumbnail: t.thumbnail,
            screenshots: t.screenshots || [],
            features: t.features || [],
            technologies: t.technologies || [],
            createdAt: t.createdAt?.toString(),
            updatedAt: t.updatedAt?.toString(),
        }));

        return {
            success: true,
            data: serializedData,
            pagination: { total, page, totalPages: Math.ceil(total / limit) },
        };
    } catch (error) {
        return { success: false, data: [] };
    }
}
export async function getTemplateById(
    id: string
): Promise<IActionResponse<IPlainWebTemplate>> {
    try {
        await connectDB();
        const template = await WebTemplate.findById(id)
            .populate("category", "name slug")
            .lean();
        if (!template) return { error: "Không tìm thấy giao diện" };

        const t: any = template;
        return {
            success: true,
            data: {
                ...t,
                _id: t._id.toString(),
                category: t.category
                    ? { ...t.category, _id: t.category._id.toString() }
                    : null,
                createdAt: t.createdAt.toString(),
                updatedAt: t.updatedAt.toString(),
            },
        };
    } catch (error) {
        return { error: "Lỗi hệ thống" };
    }
}
export async function createTemplate(
    formData: FormData,
    description: string,
    thumbnailData: { url: string; public_id: string },
    screenshotsData: { url: string; public_id: string }[]
) {
    try {
        await requireAdmin();
        await connectDB();

        const name = formData.get("name") as string;
        const categoryId = formData.get("category") as string;
        const status = formData.get("status") as string;
        const previewUrl = formData.get("previewUrl") as string;
        const price = Number(formData.get("price")) || 0;
        const isFree = formData.get("isFree") === "true";

        // Arrays handling
        const features = ((formData.get("features") as string) || "")
            .split("|")
            .filter(Boolean);
        const technologies = ((formData.get("technologies") as string) || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        let slug = formData.get("slug") as string;
        if (!slug)
            slug = slugify(name, { lower: true, strict: true, locale: "vi" });

        const exists = await WebTemplate.findOne({ slug });
        if (exists) slug = `${slug}-${Date.now()}`;

        const newTemplate = new WebTemplate({
            name,
            slug,
            description,
            category: categoryId,
            thumbnail: {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            },
            screenshots: screenshotsData.map((img) => ({
                imgUrl: img.url,
                public_id: img.public_id,
            })),
            features,
            technologies,
            previewUrl,
            price,
            isFree,
            status,
        });

        await newTemplate.save();
        revalidatePath("/admin/templates");
        return { success: true, message: "Tạo template thành công!" };
    } catch (error) {
        console.error(error);
        return { error: "Lỗi khi tạo template" };
    }
}

// 4. Update Template
export async function updateTemplate(
    formData: FormData,
    description: string,
    thumbnailData: { url: string; public_id: string } | null,
    newScreenshots: { url: string; public_id: string }[]
) {
    try {
        await requireAdmin();
        await connectDB();
        const id = formData.get("id") as string;
        const oldTemplate = await WebTemplate.findById(id);
        if (!oldTemplate) return { error: "Không tồn tại" };

        const features = ((formData.get("features") as string) || "")
            .split("|")
            .filter(Boolean);
        const technologies = ((formData.get("technologies") as string) || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const updateData: any = {
            name: formData.get("name"),
            slug: formData.get("slug"),
            category: formData.get("category"),
            status: formData.get("status"),
            previewUrl: formData.get("previewUrl"),
            price: Number(formData.get("price")) || 0,
            isFree: formData.get("isFree") === "true",
            features,
            technologies,
            description,
        };

        if (thumbnailData) {
            if (oldTemplate.thumbnail?.public_id)
                await deleteImageFromCloudinary(
                    oldTemplate.thumbnail.public_id
                );
            updateData.thumbnail = {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            };
        }

        if (newScreenshots.length > 0) {
            const currentScreenshots = oldTemplate.screenshots || [];
            const newImagesFormatted = newScreenshots.map((img) => ({
                imgUrl: img.url,
                public_id: img.public_id,
            }));
            updateData.screenshots = [
                ...currentScreenshots,
                ...newImagesFormatted,
            ];
        }

        await WebTemplate.findByIdAndUpdate(id, updateData);
        revalidatePath("/admin/templates");
        return { success: true, message: "Cập nhật thành công!" };
    } catch (error) {
        return { error: "Lỗi cập nhật" };
    }
}
export async function deleteTemplate(id: string) {
    try {
        await requireAdmin();
        await connectDB();
        const template = await WebTemplate.findById(id);
        if (!template) return { error: "Không tìm thấy" };

        if (template.thumbnail?.public_id)
            await deleteImageFromCloudinary(template.thumbnail.public_id);
        if (template.screenshots?.length > 0) {
            for (const img of template.screenshots) {
                if (img.public_id)
                    await deleteImageFromCloudinary(img.public_id);
            }
        }

        await WebTemplate.findByIdAndDelete(id);
        revalidatePath("/admin/templates");
        return { success: true, message: "Đã xóa template" };
    } catch (error) {
        return { error: "Lỗi xóa template" };
    }
}

export async function deleteTemplateScreenshot(
    templateId: string,
    publicId: string
) {
    try {
        await requireAdmin();
        await connectDB();
        await deleteImageFromCloudinary(publicId);
        await WebTemplate.findByIdAndUpdate(templateId, {
            $pull: { screenshots: { public_id: publicId } },
        });
        revalidatePath(`/admin/templates/${templateId}`);
        return { success: true };
    } catch (error) {
        return { error: "Lỗi xóa ảnh" };
    }
}
