import { getCategories } from "@/actions/category-actions";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export default async function CreateProjectPage() {
    // Lấy danh mục type='project'
    const categoriesRes = await getCategories("project");
    const categories =
        categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

    return (
        <div className="flex flex-col gap-10 p-6">
            <AdminBreadcrumb />
            <ProjectForm categories={categories} />
        </div>
    );
}
