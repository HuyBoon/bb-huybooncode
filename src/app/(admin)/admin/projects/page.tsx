import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { getProjects } from "@/actions/project-actions";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const query = params.query || "";

    const result = await getProjects(page, 10, query);
    const projects = result.success && result.data ? result.data : [];
    const pagination = result.pagination || {
        total: 0,
        page: 1,
        totalPages: 1,
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dự án</h1>
                    <p className="text-muted-foreground">
                        Quản lý Portfolio dự án.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/projects/create">
                        <Plus className="mr-2 h-4 w-4" /> Thêm dự án
                    </Link>
                </Button>
            </div>
            <Separator />
            <ProjectList data={projects} pagination={pagination} />
        </div>
    );
}
