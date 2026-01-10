import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Clock } from "lucide-react";

export default async function UserDashboardPage() {
    const session = await auth();

    const stats = [
        {
            label: "Bài viết đã lưu",
            value: "12",
            icon: Heart,
            color: "text-red-500",
        },
        {
            label: "Đã đọc",
            value: "45",
            icon: BookOpen,
            color: "text-blue-500",
        },
        {
            label: "Thời gian học",
            value: "120h",
            icon: Clock,
            color: "text-orange-500",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Chào mừng trở lại, {session?.user?.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Đây là nơi bạn quản lý các bài viết đã lưu và thông tin cá
                    nhân.
                </p>
            </div>

            {/* Thẻ thống kê nhanh */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Danh sách bài viết mới lưu (Placeholder) */}
            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Bài viết đã lưu gần đây</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Bạn chưa có bài viết nào được lưu. Hãy khám phá Blog
                            nhé!
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
