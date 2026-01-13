import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    FileText,
    FolderKanban,
    Package,
    ShoppingCart,
    Users2,
    ArrowUpRight,
    Plus,
    DollarSign,
} from "lucide-react";

import { getDashboardStats } from "@/actions/dashboard-actions";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";

// Component hiển thị thẻ thống kê nhỏ
function StatCard({ title, value, icon: Icon, description, trend }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
                {/* Ví dụ về Trend (tăng trưởng) */}
                {/* <div className="text-xs text-green-500 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> {trend}
                </div> */}
            </CardContent>
        </Card>
    );
}

// Component chính
export default async function AdminDashboardPage() {
    const res = await getDashboardStats();
    const session = await auth();
    // Fallback nếu lỗi
    const stats =
        res.success && res.stats
            ? res.stats
            : {
                  posts: 0,
                  projects: 0,
                  templates: 0,
                  orders: 0,
                  revenue: 0,
                  customers: 0,
              };
    const recentProjects =
        res.success && res.recentActivity ? res.recentActivity.projects : [];
    const recentTemplates =
        res.success && res.recentActivity ? res.recentActivity.templates : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* 1. Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Bonjour, {session?.user.name}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/">Xem Website</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/admin/posts/create">
                            <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator />

            {/* 2. Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng Doanh Thu"
                    value={new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(stats.revenue)}
                    icon={DollarSign}
                    description="Doanh thu từ Template"
                />
                <StatCard
                    title="Đơn hàng"
                    value={stats.orders}
                    icon={ShoppingCart}
                    description="Đơn hàng đang xử lý"
                />
                <StatCard
                    title="Web Templates"
                    value={stats.templates}
                    icon={Package}
                    description="Sản phẩm đang bán"
                />
                <StatCard
                    title="Khách hàng"
                    value={stats.customers}
                    icon={Users2}
                    description="Tổng user đã đăng ký"
                />
            </div>

            {/* 3. Content Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Dự án (Portfolio)"
                    value={stats.projects}
                    icon={FolderKanban}
                    description="Dự án đã thực hiện"
                />
                <StatCard
                    title="Bài viết (Blog)"
                    value={stats.posts}
                    icon={FileText}
                    description="Bài chia sẻ kiến thức"
                />
                {/* Bạn có thể thêm thẻ thống kê khác ở đây */}
            </div>

            {/* 4. Recent Activity Lists */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Cột trái: Dự án gần đây (Chiếm 4 phần) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Dự án gần đây</CardTitle>
                        <CardDescription>
                            Các dự án portfolio vừa được cập nhật.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentProjects.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Chưa có dự án nào.
                                </p>
                            ) : (
                                recentProjects.map((project: any) => (
                                    <div
                                        key={project._id}
                                        className="flex items-center"
                                    >
                                        <div className="relative h-9 w-9 rounded overflow-hidden border">
                                            {project.thumbnail?.imgUrl ? (
                                                <Image
                                                    src={
                                                        project.thumbnail.imgUrl
                                                    }
                                                    alt="Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="bg-muted w-full h-full" />
                                            )}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {project.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    project.createdAt
                                                ).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Badge
                                                variant={
                                                    project.status ===
                                                    "completed"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="text-[10px]"
                                            >
                                                {project.status === "completed"
                                                    ? "Hoàn thành"
                                                    : "Đang làm"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Cột phải: Template mới nhất (Chiếm 3 phần) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Sản phẩm mới</CardTitle>
                        <CardDescription>
                            Template vừa đăng bán.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTemplates.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Chưa có template nào.
                                </p>
                            ) : (
                                recentTemplates.map((item: any) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-9 w-9 rounded-full overflow-hidden border">
                                                {item.thumbnail?.imgUrl ? (
                                                    <Image
                                                        src={
                                                            item.thumbnail
                                                                .imgUrl
                                                        }
                                                        alt="Avatar"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="bg-muted w-full h-full" />
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none max-w-30 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.status === "available"
                                                        ? "Sẵn sàng"
                                                        : "Coming soon"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-sm">
                                            {item.isFree
                                                ? "Free"
                                                : new Intl.NumberFormat(
                                                      "vi-VN",
                                                      {
                                                          style: "currency",
                                                          currency: "VND",
                                                      }
                                                  ).format(item.price)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
