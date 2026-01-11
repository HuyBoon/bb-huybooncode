import { auth } from "@/auth";

import { ComingSoon } from "@/components/shared/ComingSoon";

export default async function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Cài đặt</h3>
                <p className="text-muted-foreground">
                    Quản lý tùy chọn hệ thống và tài khoản của bạn.
                </p>
            </div>
            <ComingSoon />
        </div>
    );
}
