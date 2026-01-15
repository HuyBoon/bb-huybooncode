import { Suspense } from "react";
import { getPosts } from "@/actions/post-actions";
import { getCategories } from "@/actions/category-actions";
import { PostCard } from "@/components/knowledge/PostCard";
import { CategorySidebar } from "@/components/knowledge/CategorySidebar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import SearchForm from "@/components/knowledge/SearchForm";
import PaginationControl from "@/components/knowledge/PaginationControl";

export const metadata = {
    title: "Kiến thức & Chia sẻ | HuyBoon Code",
    description:
        "Tổng hợp các bài viết về lập trình, công nghệ và kinh nghiệm làm việc.",
};

export default async function KnowledgePage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || "";
    const categorySlug = params.category || "";
    const [postsRes, categoriesRes] = await Promise.all([
        getPosts(page, 6, query, categorySlug),
        getCategories("post"),
    ]);

    const posts = postsRes.success && postsRes.data ? postsRes.data : [];

    const categories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
    const pagination = postsRes.pagination;

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        Kiến thức
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Chia sẻ kinh nghiệm và bài học về lập trình.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-80">
                    <SearchForm initialQuery={query} />
                </div>
            </div>

            <Separator className="mb-10" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Cột trái: Danh sách bài viết */}
                <div className="lg:col-span-3">
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
                            <h3 className="text-lg font-medium text-muted-foreground">
                                Chưa có bài viết nào phù hợp.
                            </h3>
                            <p className="text-sm text-muted-foreground/70">
                                Hãy thử tìm từ khóa khác hoặc quay lại danh mục
                                gốc.
                            </p>
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-10">
                            <PaginationControl
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                            />
                        </div>
                    )}
                </div>

                {/* Cột phải: Sidebar Danh mục & Subscribe */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        {/* Sidebar chỉ hiển thị danh mục type="post" */}
                        <CategorySidebar categories={categories} />

                        {/* Box đăng ký nhận tin */}
                        <div className="p-5 bg-card rounded-xl border shadow-xs">
                            <h4 className="font-bold text-sm mb-2 text-primary">
                                Đăng ký nhận tin
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                Nhận bài viết mới nhất qua email hàng tuần.
                                Không spam.
                            </p>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Email của bạn..."
                                    className="h-9 text-sm"
                                />
                                <button className="w-full h-9 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors">
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
