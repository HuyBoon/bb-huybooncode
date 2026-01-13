import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getPostBySlug, getRelatedPosts } from "@/actions/post-actions";
import { getCategories } from "@/actions/category-actions";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PostHeader } from "@/components/knowledge/PostHeader";
import { PostContent } from "@/components/knowledge/PostContent";
import { PostFooter } from "@/components/knowledge/PostFooter";
import { TableOfContents } from "@/components/knowledge/TableOfContents";
import { RelatedPosts } from "@/components/knowledge/RelatedPosts";
import { CategorySidebar } from "@/components/knowledge/CategorySidebar";
import { MobilePostSidebar } from "@/components/knowledge/MobilePostSidebar";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const res = await getPostBySlug(slug);
    if (!res.success || !res.data) return { title: "Not Found" };
    return {
        title: `${res.data.title} | HuyBoon Knowledge`,
        description: res.data.metaDescription,
        openGraph: {
            images: res.data.thumbnail?.imgUrl
                ? [res.data.thumbnail.imgUrl]
                : [],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const postRes = await getPostBySlug(slug);
    if (!postRes.success || !postRes.data) return notFound();
    const post = postRes.data;

    const categoryId =
        typeof post.category === "string" ? post.category : post.category?._id;

    const [categoriesRes, relatedRes] = await Promise.all([
        getCategories(),
        categoryId
            ? getRelatedPosts(post._id, categoryId)
            : Promise.resolve({ success: true, data: [] }),
    ]);

    const categories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];
    const relatedPosts =
        relatedRes.success && relatedRes.data ? relatedRes.data : [];

    return (
        <div className="container mx-auto px-4 py-10 max-w-7xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="-ml-3 text-muted-foreground hover:text-primary"
                >
                    <Link href="/knowledge">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh
                        sách
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <article className="lg:col-span-3">
                    <PostHeader post={post} />

                    <PostContent content={post.content} />

                    <Separator className="my-10" />

                    <PostFooter tags={post.tags} title={post.title} />

                    <RelatedPosts posts={relatedPosts} />
                </article>

                <aside className="hidden lg:block lg:col-span-1 space-y-8">
                    <div className="sticky top-24 space-y-8">
                        <TableOfContents />
                        <CategorySidebar categories={categories} />
                    </div>
                </aside>
                <MobilePostSidebar>
                    <TableOfContents />
                    <Separator className="my-4" />
                    <CategorySidebar categories={categories} />
                </MobilePostSidebar>
            </div>
        </div>
    );
}
