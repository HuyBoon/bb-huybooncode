import Link from "next/link";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/actions/auth-actions";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-muted/40">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>

            <div className="text-center space-y-2 max-w-md px-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    Truy cập bị từ chối
                </h1>
                <p className="text-muted-foreground">
                    Tài khoản của bạn không có quyền truy cập vào trang Quản trị
                    (Admin). Vui lòng liên hệ quản trị viên hoặc đăng nhập bằng
                    tài khoản khác.
                </p>
            </div>

            <div className="flex gap-4">
                <Button variant="outline" asChild>
                    <Link href="/">Về trang chủ</Link>
                </Button>

                {/* Nút Logout cứu cánh */}
                <form action={handleSignOut}>
                    <Button variant="destructive">Đăng xuất ngay</Button>
                </form>
            </div>
        </div>
    );
}
