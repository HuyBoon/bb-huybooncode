import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    ArrowLeft,
    Edit,
    CheckCircle2,
    FileText,
    Calendar,
} from "lucide-react";

import { getPostById } from "@/actions/post-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SeoPreview } from "@/components/admin/posts/SeoPreview";

import { PublishButton } from "@/components/admin/posts/PublishButton";

export default async function PreviewPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await getPostById(id);
    console.log("res", res);
    if (!res.success || !res.data) return notFound();
    const post = res.data;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/posts">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                            </Link>
                        </Button>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="font-semibold text-lg">
                                Xem trước bài viết
                            </span>
                            <Badge
                                variant={
                                    post.status === "published"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {post.status === "published"
                                    ? "Đang công khai"
                                    : "Bản nháp"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/posts/edit/${post._id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </Link>
                        </Button>

                        <PublishButton
                            postId={post._id}
                            currentStatus={post.status}
                        />
                    </div>
                </div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT (Mô phỏng trang chi tiết thật) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Ảnh bìa */}
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm border bg-muted">
                            {post.thumbnail?.imgUrl && (
                                <Image
                                    src={post.thumbnail.imgUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="text-primary border-primary/20 bg-primary/5"
                                >
                                    {post.category?.name || "Chưa phân loại"}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar size={14} />
                                    {format(
                                        new Date(post.createdAt),
                                        "dd MMMM, yyyy",
                                        { locale: vi }
                                    )}
                                </span>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <FileText size={14} />
                                    {post.timeRead || "5 min read"}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                                {post.title}
                            </h1>

                            {post.metaDescription && (
                                <p className="text-xl text-muted-foreground leading-relaxed font-light">
                                    {post.metaDescription}
                                </p>
                            )}
                        </div>

                        <Separator />

                        {/* Nội dung chính (Sử dụng class ck-content để style giống Editor) */}
                        <article
                            className="ck-content prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>

                    {/* CỘT PHẢI: CHECKLIST SEO & INFO */}
                    <div className="space-y-6">
                        {/* Preview SEO */}
                        <SeoPreview
                            title={post.title}
                            description={post.metaDescription}
                            slug={post.slug}
                            thumbnailUrl={post.thumbnail?.imgUrl}
                        />

                        {/* Checklist đơn giản */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CheckCircle2
                                    className="text-green-500"
                                    size={18}
                                />
                                Kiểm tra nhanh
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 w-2 h-2 rounded-full ${
                                            post.title.length > 40 &&
                                            post.title.length < 70
                                                ? "bg-green-500"
                                                : "bg-orange-500"
                                        }`}
                                    />
                                    <span>
                                        Độ dài tiêu đề:{" "}
                                        <strong>{post.title.length}</strong> ký
                                        tự (Tốt: 40-70)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 w-2 h-2 rounded-full ${
                                            post.metaDescription.length > 120 &&
                                            post.metaDescription.length < 160
                                                ? "bg-green-500"
                                                : "bg-orange-500"
                                        }`}
                                    />
                                    <span>
                                        Độ dài mô tả:{" "}
                                        <strong>
                                            {post.metaDescription.length}
                                        </strong>{" "}
                                        ký tự (Tốt: 120-160)
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 w-2 h-2 rounded-full ${
                                            post.thumbnail?.imgUrl
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    />
                                    <span>
                                        Ảnh đại diện:{" "}
                                        {post.thumbnail?.imgUrl
                                            ? "Đã có"
                                            : "Chưa có"}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <div
                                        className={`mt-0.5 w-2 h-2 rounded-full ${
                                            post.slug
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    />
                                    <span>Slug: {post.slug}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
