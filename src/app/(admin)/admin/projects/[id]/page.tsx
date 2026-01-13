import { notFound } from "next/navigation";
import { getProjectById } from "@/actions/project-actions";
import { getCategories } from "@/actions/category-actions";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export default async function EditProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [projectRes, categoriesRes] = await Promise.all([
        getProjectById(id),
        getCategories("project"),
    ]);

    if (!projectRes.success || !projectRes.data) return notFound();

    const categories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <ProjectForm
                categories={categories}
                initialData={projectRes.data}
            />
        </div>
    );
}
