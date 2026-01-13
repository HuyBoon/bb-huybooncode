import { getAnalyticsData } from "@/actions/analytics-actions";
import {
    TrafficChart,
    RevenueChart,
    DeviceChart,
} from "@/components/admin/analytics/Charts";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, DollarSign, MousePointerClick } from "lucide-react";

export default async function AnalyticsPage() {
    const { data } = await getAnalyticsData();

    if (!data) return <div>Lỗi tải dữ liệu</div>;

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Phân tích hiệu quả hoạt động của Website và Kinh doanh.
                </p>
            </div>

            {/* 1. KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tổng lượt xem
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,231</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +20.1% so
                            với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Doanh thu tháng
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5.6 Tr</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +15% so với
                            tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tỷ lệ thoát (Bounce)
                        </CardTitle>
                        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42.3%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            -2% so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Thời gian TB
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2m 45s</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12s so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Main Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <TrafficChart data={data.trafficData} />
                </div>
                <div className="col-span-3">
                    <RevenueChart data={data.revenueData} />
                </div>
            </div>

            {/* 3. Bottom Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Top Content List */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Nội dung phổ biến</CardTitle>
                        <CardDescription>
                            Các trang được xem nhiều nhất.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.topContent.map((item: any, i: number) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {item.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] h-5"
                                            >
                                                {item.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="font-medium text-sm text-muted-foreground">
                                        {item.views.toLocaleString()} views
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Device Chart */}
                <div className="col-span-3">
                    <DeviceChart data={data.deviceData} />
                </div>
            </div>
        </div>
    );
}
