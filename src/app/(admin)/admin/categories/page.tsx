import { getCategories } from "@/actions/category-actions";
import { CategoryTreeList } from "@/components/admin/categories/CategoryTreeList";
import { Separator } from "@/components/ui/separator";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const result = await getCategories();

    const categories =
        result.success && Array.isArray(result.data) ? result.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />

            <Separator />

            <CategoryTreeList data={categories} />
        </div>
    );
}
