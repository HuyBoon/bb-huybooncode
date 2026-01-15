"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { auth } from "@/auth";
import slugify from "slugify";
import { deleteImageFromCloudinary } from "@/actions/image-actions";
import { IActionResponse, IPlainPost } from "@/types/backend";
import { requireAdmin } from "@/lib/auth-guards";

export async function getPosts(
    page = 1,
    limit = 6,
    search = "",
    categorySlug = "",
    statusFilter: "published" | "draft" | "all" = "published"
): Promise<IActionResponse<IPlainPost[]>> {
    try {
        await connectDB();
        const _init = Category;

        const skip = (page - 1) * limit;
        const query: any = {};

        if (statusFilter !== "all") {
            query.status = statusFilter;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } },
            ];
        }

        if (categorySlug) {
            const category = await Category.findOne({
                slug: categorySlug,
                type: "post",
            });

            if (category) {
                query.category = category._id;
            } else {
                return {
                    success: true,
                    data: [],
                    pagination: { total: 0, page: 1, totalPages: 0 },
                };
            }
        }

        const posts = await Post.find(query)
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Post.countDocuments(query);

        const serializedPosts: IPlainPost[] = posts.map((post: any) => ({
            ...post,
            _id: post._id.toString(),
            tags: post.tags || [],
            category: post.category
                ? { ...post.category, _id: post.category._id.toString() }
                : null,
            publishedDate: post.publishedDate?.toString(),
            createdAt: post.createdAt?.toString(),
            updatedAt: post.updatedAt?.toString(),
        }));

        return {
            success: true,
            data: serializedPosts,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error("Get posts error:", error);
        return { success: false, data: [] };
    }
}

export async function getPostById(
    id: string
): Promise<IActionResponse<IPlainPost>> {
    try {
        await connectDB();
        const post = await Post.findById(id)
            .populate("category", "name slug status")
            .lean();

        if (!post) return { error: "Không tìm thấy bài viết" };

        const p: any = post;

        const serializedPost: IPlainPost = {
            ...p,
            _id: p._id.toString(),
            tags: p.tags || [],
            category: p.category
                ? {
                      _id: p.category._id.toString(),
                      name: p.category.name,
                      slug: p.category.slug,
                      status: p.category.status || "active",
                      createdAt: "",
                      updatedAt: "",
                  }
                : null,
            publishedDate: p.publishedDate?.toString(),
            createdAt: p.createdAt.toString(),
            updatedAt: p.updatedAt.toString(),
        };

        return { success: true, data: serializedPost };
    } catch (error) {
        return { error: "Lỗi lấy bài viết" };
    }
}

export async function getPostBySlug(
    slug: string
): Promise<IActionResponse<IPlainPost>> {
    try {
        await connectDB();

        const post = await Post.findOne({ slug })
            .populate("category", "name slug")
            .lean();

        if (!post) return { error: "Bài viết không tồn tại" };

        const p: any = post;

        const serializedPost: IPlainPost = {
            ...p,
            _id: p._id.toString(),
            tags: p.tags || [],
            category: p.category
                ? {
                      _id: p.category._id.toString(),
                      name: p.category.name,
                      slug: p.category.slug,
                      status: "active",
                      createdAt: "",
                      updatedAt: "",
                  }
                : null,
            publishedDate: p.publishedDate?.toString(),
            createdAt: p.createdAt.toString(),
            updatedAt: p.updatedAt.toString(),
        };

        return { success: true, data: serializedPost };
    } catch (error) {
        console.error("Get post by slug error:", error);
        return { error: "Lỗi hệ thống khi lấy bài viết" };
    }
}

export async function createPost(
    formData: FormData,
    content: string,
    thumbnailData: { url: string; public_id: string }
) {
    try {
        const user = await requireAdmin();
        await connectDB();

        const title = formData.get("title") as string;
        const descriptions = formData.get("descriptions") as string;
        const categoryId = formData.get("category") as string;
        const status = formData.get("status") as string;
        const lessionIdRaw = formData.get("lessionId");

        const tagsRaw = formData.get("tags") as string;
        const tags = tagsRaw
            ? tagsRaw
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        let slug = formData.get("slug") as string;
        if (!slug) {
            slug = slugify(title, { lower: true, strict: true, locale: "vi" });
        }
        const existingPost = await Post.findOne({ slug });
        if (existingPost) slug = `${slug}-${Date.now()}`;

        const wordCount = content.replace(/<[^>]*>?/gm, "").length;
        const readTime = Math.ceil(wordCount / 200) + " min read";

        const newPost = new Post({
            title,
            slug,
            category: categoryId,
            metaDescription: descriptions,
            content,
            thumbnail: {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            },
            tags: tags,
            lessionId: lessionIdRaw ? Number(lessionIdRaw) : undefined,
            timeRead: readTime,
            status: status || "draft",
            author: user.name || "Admin",
            publishedDate: status === "published" ? new Date() : undefined,
        });

        await newPost.save();

        revalidatePath("/admin/posts");
        return { success: true, message: "Tạo bài viết thành công!" };
    } catch (error: any) {
        console.error("Create post error:", error);
        return { error: "Lỗi khi tạo bài viết" };
    }
}

// ... updatePost, deletePost, togglePostStatus giữ nguyên ...

export async function updatePost(
    formData: FormData,
    content: string,
    thumbnailData: { url: string; public_id: string } | null
) {
    try {
        await connectDB();
        const id = formData.get("id") as string;
        const oldPost = await Post.findById(id);
        if (!oldPost) return { error: "Bài viết không tồn tại" };

        const tagsRaw = formData.get("tags") as string;
        const tags = tagsRaw
            ? tagsRaw
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        const updateData: any = {
            title: formData.get("title"),
            slug: formData.get("slug"),
            metaDescription: formData.get("descriptions"),
            category: formData.get("category"),
            status: formData.get("status"),
            tags: tags,
            lessionId: formData.get("lessionId")
                ? Number(formData.get("lessionId"))
                : undefined,
            content,
            publishedDate:
                formData.get("status") === "published" && !oldPost.publishedDate
                    ? new Date()
                    : oldPost.publishedDate,
        };

        if (thumbnailData) {
            if (oldPost.thumbnail?.public_id) {
                await deleteImageFromCloudinary(oldPost.thumbnail.public_id);
            }
            updateData.thumbnail = {
                imgUrl: thumbnailData.url,
                public_id: thumbnailData.public_id,
            };
        }

        await Post.findByIdAndUpdate(id, updateData);
        revalidatePath("/admin/posts");
        revalidatePath(`/admin/posts/preview/${id}`);

        return { success: true, message: "Cập nhật thành công!" };
    } catch (error) {
        return { error: "Lỗi cập nhật" };
    }
}

export async function deletePost(id: string) {
    try {
        await connectDB();
        const post = await Post.findById(id);
        if (!post) return { error: "Không tìm thấy" };

        if (post.thumbnail?.public_id) {
            await deleteImageFromCloudinary(post.thumbnail.public_id);
        }

        await Post.findByIdAndDelete(id);
        revalidatePath("/admin/posts");
        return { success: true, message: "Đã xóa bài viết" };
    } catch (error) {
        return { error: "Lỗi xóa bài viết" };
    }
}

export async function togglePostStatus(id: string, newStatus: string) {
    try {
        await connectDB();
        const updateData: any = { status: newStatus };
        if (newStatus === "published") {
            const post = await Post.findById(id);
            if (post && !post.publishedDate)
                updateData.publishedDate = new Date();
        }
        await Post.findByIdAndUpdate(id, updateData);
        revalidatePath("/admin/posts");
        revalidatePath(`/admin/posts/preview/${id}`);
        return {
            success: true,
            message:
                newStatus === "published"
                    ? "Đã xuất bản bài viết!"
                    : "Đã chuyển về bản nháp.",
        };
    } catch (error) {
        return { error: "Lỗi cập nhật trạng thái" };
    }
}

// 7. Lấy bài viết liên quan
export async function getRelatedPosts(
    currentPostId: string,
    categoryId: string,
    limit = 6
): Promise<IActionResponse<IPlainPost[]>> {
    try {
        await connectDB();

        // Lấy bài cùng category, trừ bài hiện tại
        // Vì bài viết hiện tại đã là type 'post' rồi (do nằm trong Post Model),
        // nên related cũng sẽ là post thôi.
        const posts = await Post.find({
            _id: { $ne: currentPostId },
            category: categoryId,
            status: "published",
        })
            .populate("category", "name slug")
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const serializedPosts: IPlainPost[] = posts.map((post: any) => ({
            ...post,
            _id: post._id.toString(),
            category: post.category
                ? { ...post.category, _id: post.category._id.toString() }
                : null,
            publishedDate: post.publishedDate?.toString(),
            createdAt: post.createdAt?.toString(),
            updatedAt: post.updatedAt?.toString(),
            tags: post.tags || [],
        }));

        return { success: true, data: serializedPosts };
    } catch (error) {
        return { success: false, data: [] };
    }
}
