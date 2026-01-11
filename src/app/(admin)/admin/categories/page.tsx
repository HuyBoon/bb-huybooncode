import { getCategories } from "@/actions/category-actions";
import { CategoryTreeList } from "@/components/admin/categories/CategoryTreeList"; // Import component mới
import { Separator } from "@/components/ui/separator";

// Dynamic rendering
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
    const result = await getCategories();

    // FIX LỖI TS: Đảm bảo categories luôn là mảng, không bao giờ undefined
    const categories =
        result.success && Array.isArray(result.data) ? result.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Danh mục bài viết
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý phân loại và cấu trúc cây thư mục.
                    </p>
                </div>
                {/* Nút Thêm mới đã được chuyển vào trong CategoryTreeList cho gọn */}
            </div>

            <Separator />

            {/* Truyền dữ liệu vào List cây */}
            <CategoryTreeList data={categories} />
        </div>
    );
}
