import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    Edit,
    ExternalLink,
    Github,
    Calendar,
    Layers,
    Briefcase,
    ArrowLeft,
} from "lucide-react";

import { getProjectById } from "@/actions/project-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const dynamic = "force-dynamic";

export default async function ProjectPreviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await getProjectById(id);

    if (!res.success || !res.data) {
        return notFound();
    }

    const project = res.data;

    return (
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
            <AdminBreadcrumb />

            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-2 -my-2 border-b">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/projects">
                            <ArrowLeft size={20} />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight truncate max-w-75 md:max-w-md">
                        {project.title}
                    </h1>
                    <Badge
                        variant={
                            project.status === "completed"
                                ? "default"
                                : "secondary"
                        }
                    >
                        {project.status === "completed"
                            ? "Hoàn thành"
                            : "Đang thực hiện"}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    {project.demoUrl && (
                        <Button variant="outline" asChild size="sm">
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="mr-2 h-4 w-4" /> Live
                                Demo
                            </a>
                        </Button>
                    )}
                    <Button asChild size="sm">
                        <Link href={`/admin/projects/${project._id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN (2/3): Main Content --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. Thumbnail */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border shadow-sm bg-muted">
                        {project.thumbnail?.imgUrl ? (
                            <Image
                                src={project.thumbnail.imgUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No Thumbnail
                            </div>
                        )}
                    </div>

                    {/* 2. Description (HTML Content) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Study & Chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="ck-content prose prose-stone dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: project.description,
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* 3. Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Layers size={20} /> Thư viện ảnh (
                                {project.gallery.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {project.gallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-video rounded-lg overflow-hidden border shadow-sm group"
                                    >
                                        <Image
                                            src={img.imgUrl}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN (1/3): Meta Info --- */}
                <div className="space-y-6">
                    {/* Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Thông tin dự án
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {/* Short Desc */}
                            <div className="text-muted-foreground italic border-l-2 pl-3">
                                {project.shortDescription}
                            </div>
                            <Separator />

                            {/* Client */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Briefcase size={16} /> Khách hàng
                                </span>
                                <span className="font-medium">
                                    {project.client || "Cá nhân"}
                                </span>
                            </div>

                            {/* Category */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Layers size={16} /> Danh mục
                                </span>
                                <span className="font-medium">
                                    {project.category?.name || "Chưa phân loại"}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar size={16} /> Ngày hoàn thành
                                </span>
                                <span>
                                    {project.completionDate
                                        ? format(
                                              new Date(project.completionDate),
                                              "dd/MM/yyyy"
                                          )
                                        : "N/A"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Công nghệ sử dụng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack &&
                                project.techStack.length > 0 ? (
                                    project.techStack.map((tech, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="px-2 py-1"
                                        >
                                            {tech}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground">
                                        Chưa cập nhật
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Liên kết
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {project.demoUrl ? (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline border p-2 rounded-md hover:bg-muted"
                                >
                                    <ExternalLink size={16} />
                                    <span className="truncate">
                                        Xem Demo trực tiếp
                                    </span>
                                </a>
                            ) : (
                                <div className="text-muted-foreground text-xs">
                                    Chưa có link Demo
                                </div>
                            )}

                            {project.repoUrl ? (
                                <a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-foreground hover:underline border p-2 rounded-md hover:bg-muted"
                                >
                                    <Github size={16} />
                                    <span className="truncate">
                                        Source Code (Repo)
                                    </span>
                                </a>
                            ) : (
                                <div className="text-muted-foreground text-xs">
                                    Chưa có link Repo
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Meta SEO Preview */}
                    <div className="rounded-lg bg-muted/50 p-4 border text-xs text-muted-foreground space-y-1">
                        <p>
                            <strong>Slug:</strong> {project.slug}
                        </p>
                        <p>
                            <strong>Created:</strong>{" "}
                            {format(
                                new Date(project.createdAt),
                                "dd/MM/yyyy HH:mm"
                            )}
                        </p>
                        <p>
                            <strong>ID:</strong> {project._id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
