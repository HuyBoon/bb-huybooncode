import { getCategories } from "@/actions/category-actions";
import { TemplateForm } from "@/components/admin/templates/TemplateForm";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export default async function CreateTemplatePage() {
    const categoriesRes = await getCategories("template");
    return (
        <div className="flex flex-col gap-10 p-6">
            <AdminBreadcrumb />
            <TemplateForm categories={categoriesRes.data || []} />
        </div>
    );
}
