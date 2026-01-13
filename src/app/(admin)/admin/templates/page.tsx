import Link from "next/link";
import { Plus } from "lucide-react";
import { getTemplates } from "@/actions/template-actions";
import { TemplateList } from "@/components/admin/templates/TemplateList";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; query?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const result = await getTemplates(page, 10, params.query || "");
    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Giao diện mẫu
                    </h1>
                    <p className="text-muted-foreground">
                        Kho giao diện website.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/templates/create">
                        <Plus className="mr-2 h-4 w-4" /> Thêm mới
                    </Link>
                </Button>
            </div>
            <Separator />
            <TemplateList
                data={result.data || []}
                pagination={
                    result.pagination || { total: 0, page: 1, totalPages: 1 }
                }
            />
        </div>
    );
}
