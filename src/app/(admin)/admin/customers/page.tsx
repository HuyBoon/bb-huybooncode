import { getAllUsers } from "@/actions/admin-users-actions";
import { UsersTable } from "@/components/admin/customers/UsersTable";
import { Separator } from "@/components/ui/separator";
export const dynamic = "force-dynamic";
export default async function AdminCustomersPage() {
    // 1. Fetch dữ liệu từ Server Actions
    const result = await getAllUsers();

    // Nếu có lỗi hoặc không có data, xử lý fallback
    const users = result.success ? result.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Khách hàng
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý danh sách người dùng và phân quyền hệ thống.
                    </p>
                </div>
            </div>

            <Separator />

            {/* 2. Truyền data xuống Client Component */}
            {/* @ts-ignore: Bỏ qua check type phức tạp của Mongoose lean */}
            <UsersTable initialUsers={users} />
        </div>
    );
}
