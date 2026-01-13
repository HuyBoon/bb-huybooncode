import { getCategories } from "@/actions/category-actions";
import { getPostById } from "@/actions/post-actions";
import { PostForm } from "@/components/admin/posts/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [categoriesRes, postRes] = await Promise.all([
        getCategories(),
        getPostById(id),
    ]);

    if (!postRes.success || !postRes.data) {
        return notFound();
    }
    const categories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

    return (
        <div className="p-6">
            <PostForm categories={categories} initialData={postRes.data} />
        </div>
    );
}
