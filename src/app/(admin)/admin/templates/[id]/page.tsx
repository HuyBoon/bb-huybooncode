import { notFound } from "next/navigation";
import { getTemplateById } from "@/actions/template-actions";
import { getCategories } from "@/actions/category-actions";
import { TemplateForm } from "@/components/admin/templates/TemplateForm";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export default async function EditTemplatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [templateRes, categoriesRes] = await Promise.all([
        getTemplateById(id),
        getCategories("template"),
    ]);
    if (!templateRes.success || !templateRes.data) return notFound();
    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <TemplateForm
                categories={categoriesRes.data || []}
                initialData={templateRes.data}
            />
        </div>
    );
}
