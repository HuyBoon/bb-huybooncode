import { getSiteSettings } from "@/actions/admin-settings-actions";
import { AdminSettingsForm } from "@/components/admin/settings/AdminSettingsForm";
import { Separator } from "@/components/ui/separator";

export default async function AdminSettingsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Cấu hình hệ thống
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý các thiết lập toàn cục cho website.
                    </p>
                </div>
            </div>
            <Separator />

            <AdminSettingsForm initialData={settings} />
        </div>
    );
}
