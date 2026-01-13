import { getAllUsers } from "@/actions/admin-users-actions";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { UsersTable } from "@/components/admin/customers/UsersTable";
import { Separator } from "@/components/ui/separator";
export const dynamic = "force-dynamic";
export default async function AdminCustomersPage() {
    const result = await getAllUsers();

    const users = result.success ? result.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
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
            <UsersTable initialUsers={users} />
        </div>
    );
}
