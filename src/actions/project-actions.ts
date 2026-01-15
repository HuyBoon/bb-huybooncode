"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import Project from "@/models/Project";
import Category from "@/models/Category";
import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
} from "@/actions/image-actions";
import { IActionResponse, IPlainProject } from "@/types/backend";
import slugify from "slugify";
import { requireAdmin } from "@/lib/auth-guards";

// 1. Get Projects
export async function getProjects(
    page = 1,
    limit = 10,
    search = "",
    categorySlug = ""
): Promise<IActionResponse<IPlainProject[]>> {
    try {
        await connectDB();
        const _init = Category;

        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }

        if (categorySlug) {
            const category = await Category.findOne({
                slug: categorySlug,
                type: "project",
            });
            if (category) {
                query.category = category._id;
            }
        }

        const projects = await Project.find(query)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Project.countDocuments(query);

        // Map data
        const serializedProjects: IPlainProject[] = projects.map((p: any) => ({
            ...p,
            _id: p._id.toString(),
            category: p.category
                ? { ...p.category, _id: p.category._id.toString() }
                : null,
            thumbnail: p.thumbnail,
            gallery: p.gallery || [],
            techStack: p.techStack || [],
            createdAt: p.createdAt?.toString(),
            updatedAt: p.updatedAt?.toString(),
            completionDate: p.completionDate?.toString(),
        }));

        return {
            success: true,
            data: serializedProjects,
            pagination: { total, page, totalPages: Math.ceil(total / limit) },
        };
    } catch (error) {
        return { success: false, data: [] };
    }
}
export async function getProjectById(
    id: string
): Promise<IActionResponse<IPlainProject>> {
    try {
        await connectDB();
        const project = await Project.findById(id)
            .populate("category", "name slug")
            .lean();
        if (!project) return { error: "Không tìm thấy dự án" };

        const p: any = project;
        return {
            success: true,
            data: {
                ...p,
                _id: p._id.toString(),
                category: p.category
                    ? { ...p.category, _id: p.category._id.toString() }
                    : null,
                createdAt: p.createdAt.toString(),
                updatedAt: p.updatedAt.toString(),
                completionDate: p.completionDate?.toString(),
            },
        };
    } catch (error) {
        return { error: "Lỗi hệ thống" };
    }
}

export async function createProject(
    formData: FormData,
    description: string,
    thumbnailData: { url: string; public_id: string },
    galleryData: { url: string; public_id: string }[]
) {
    try {
        await requireAdmin();
        await connectDB();

        const title = formData.get("title") as string;
        const shortDescription = formData.get("shortDescription") as string;
        const categoryId = formData.get("category") as string;
        const status = formData.get("status") as string;
        const client = formData.get("client") as string;
        const demoUrl = formData.get("demoUrl") as string;
        const repoUrl = formData.get("repoUrl") as string;
        const isFeatured = formData.get("isFeatured") === "true";

        const techStackRaw = formData.get("techStack") as string;
        const techStack = techStackRaw
            ? techStackRaw
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        let slug = formData.get("slug") as string;
        if (!slug)
            slug = slugify(title, { lower: true, strict: true, locale: "vi" });

        const exists = await Project.findOne({ slug });
        if (exists) slug = `${slug}-${Date.now()}`;

        const newProject = new Project({
            title,
            slug,
            description,
            shortDescription,
            category: categoryId,
            thumbnail: {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            },
            gallery: galleryData.map((img) => ({
                imgUrl: img.url,
                public_id: img.public_id,
            })),
            techStack,
            client,
            demoUrl,
            repoUrl,
            status,
            isFeatured,
            completionDate: new Date(),
        });

        await newProject.save();
        revalidatePath("/admin/projects");
        return { success: true, message: "Tạo dự án thành công!" };
    } catch (error) {
        console.error(error);
        return { error: "Lỗi khi tạo dự án" };
    }
}
export async function updateProject(
    formData: FormData,
    description: string,
    thumbnailData: { url: string; public_id: string } | null,
    newGalleryImages: { url: string; public_id: string }[]
) {
    try {
        await requireAdmin();
        await connectDB();
        const id = formData.get("id") as string;
        const oldProject = await Project.findById(id);
        if (!oldProject) return { error: "Dự án không tồn tại" };

        const techStackRaw = formData.get("techStack") as string;
        const techStack = techStackRaw
            ? techStackRaw
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        const updateData: any = {
            title: formData.get("title"),
            slug: formData.get("slug"),
            shortDescription: formData.get("shortDescription"),
            category: formData.get("category"),
            status: formData.get("status"),
            client: formData.get("client"),
            demoUrl: formData.get("demoUrl"),
            repoUrl: formData.get("repoUrl"),
            isFeatured: formData.get("isFeatured") === "true",
            techStack,
            description,
        };

        if (thumbnailData) {
            if (oldProject.thumbnail?.public_id) {
                await deleteImageFromCloudinary(oldProject.thumbnail.public_id);
            }
            updateData.thumbnail = {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            };
        }

        if (newGalleryImages.length > 0) {
            const currentGallery = oldProject.gallery || [];
            const newImagesFormatted = newGalleryImages.map((img) => ({
                imgUrl: img.url,
                public_id: img.public_id,
            }));
            updateData.gallery = [...currentGallery, ...newImagesFormatted];
        }

        await Project.findByIdAndUpdate(id, updateData);
        revalidatePath("/admin/projects");
        return { success: true, message: "Cập nhật dự án thành công!" };
    } catch (error) {
        return { error: "Lỗi cập nhật" };
    }
}

export async function deleteProject(id: string) {
    try {
        await requireAdmin();

        await connectDB();
        const project = await Project.findById(id);
        if (!project) return { error: "Không tìm thấy" };

        if (project.thumbnail?.public_id) {
            await deleteImageFromCloudinary(project.thumbnail.public_id);
        }

        if (project.gallery && project.gallery.length > 0) {
            for (const img of project.gallery) {
                if (img.public_id)
                    await deleteImageFromCloudinary(img.public_id);
            }
        }

        await Project.findByIdAndDelete(id);
        revalidatePath("/admin/projects");
        return { success: true, message: "Đã xóa dự án" };
    } catch (error) {
        return { error: "Lỗi xóa dự án" };
    }
}
export async function deleteProjectGalleryImage(
    projectId: string,
    publicId: string
) {
    try {
        await requireAdmin();

        await connectDB();
        await deleteImageFromCloudinary(publicId);
        await Project.findByIdAndUpdate(projectId, {
            $pull: { gallery: { public_id: publicId } },
        });
        revalidatePath(`/admin/projects/${projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Lỗi xóa ảnh" };
    }
}
