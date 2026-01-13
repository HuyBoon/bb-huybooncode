import { getPosts } from "@/actions/post-actions";
import { PostList } from "@/components/admin/posts/PostList";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function PostsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const query = params.query || "";

    // 👇 SỬA Ở ĐÂY: Truyền thêm tham số "" (categorySlug rỗng) và "all" (lấy tất cả trạng thái)
    const result = await getPosts(page, 6, query, "", "all");

    const posts = result.success && result.data ? result.data : [];

    const pagination = result.pagination || {
        page: 1,
        totalPages: 1,
        total: 0,
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bài viết
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý bài viết blog ({pagination.total} bài).
                    </p>
                </div>
            </div>
            <Separator />

            <PostList data={posts} pagination={pagination} />
        </div>
    );
}
