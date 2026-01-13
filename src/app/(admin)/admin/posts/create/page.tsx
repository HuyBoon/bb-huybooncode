import { getCategories } from "@/actions/category-actions";
import { PostForm } from "@/components/admin/posts/PostForm";

export default async function CreatePostPage() {
    const res = await getCategories();
    const categories = res.success && res.data ? res.data : [];

    return (
        <div className="p-6">
            <PostForm categories={categories} />
        </div>
    );
}
