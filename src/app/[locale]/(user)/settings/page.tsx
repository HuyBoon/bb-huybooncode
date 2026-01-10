import { auth } from "@/auth";
import { SettingsForm } from "@/components/user/SettingsForm";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
    const session = await auth();
    // Ở đây bạn có thể fetch settings từ DB nếu có lưu setting riêng
    // const settings = await getUserSettings(session.user.id);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Cài đặt</h3>
                <p className="text-muted-foreground">
                    Quản lý tùy chọn hệ thống và tài khoản của bạn.
                </p>
            </div>
            <Separator />

            <SettingsForm />
        </div>
    );
}
