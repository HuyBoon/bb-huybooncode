import { auth } from "@/auth";
import { NotificationList } from "@/components/user/NotificationList";
import { Separator } from "@/components/ui/separator";
import { NotificationItem } from "@/types";
import { ComingSoon } from "@/components/shared/ComingSoon";

// Mock Data (Sau này thay bằng DB fetch)
async function getNotifications(userId: string): Promise<NotificationItem[]> {
    // await connectDB();
    // return Notification.find({ userId }).sort({ createdAt: -1 });

    return [
        {
            id: "1",
            title: "Chào mừng đến với HuyBoonTech!",
            message:
                "Cảm ơn bạn đã đăng ký tài khoản. Hãy cập nhật hồ sơ để trải nghiệm đầy đủ tính năng nhé.",
            type: "success",
            isRead: false,
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            title: "Cảnh báo bảo mật",
            message:
                "Chúng tôi phát hiện đăng nhập lạ từ thiết bị iPhone 15 tại Hà Nội.",
            type: "warning",
            isRead: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 tiếng trước
        },
        {
            id: "3",
            title: "Bảo trì hệ thống",
            message:
                "Hệ thống sẽ bảo trì vào 00:00 ngày mai để nâng cấp server.",
            type: "info",
            isRead: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        },
        {
            id: "4",
            title: "Thanh toán thất bại",
            message:
                "Giao dịch mua gói Pro của bạn không thành công. Vui lòng kiểm tra lại thẻ.",
            type: "error",
            isRead: true,
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 ngày trước
        },
    ];
}

export default async function NotificationsPage() {
    const session = await auth();
    const notifications = await getNotifications(session?.user?.id as string);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">
                    Trung tâm thông báo
                </h3>
                <p className="text-muted-foreground">
                    Xem lại lịch sử hoạt động và tin tức từ hệ thống.
                </p>
            </div>
            <ComingSoon />
        </div>
    );
}
