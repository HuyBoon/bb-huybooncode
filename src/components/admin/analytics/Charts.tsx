"use client";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

// 1. Biểu đồ Traffic (Line)
export function TrafficChart({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lưu lượng truy cập</CardTitle>
                <CardDescription>
                    Số lượt xem trang & người dùng trong tuần qua.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="views"
                            stroke="#2563eb"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                            name="Page Views"
                        />
                        <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#16a34a"
                            strokeWidth={2}
                            name="Visitors"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// 2. Biểu đồ Doanh thu (Bar)
export function RevenueChart({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Doanh thu</CardTitle>
                <CardDescription>
                    Doanh thu bán Template 6 tháng gần nhất (VNĐ).
                </CardDescription>
            </CardHeader>
            <CardContent className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000000}M`}
                        />
                        <Tooltip
                            formatter={(value: any) =>
                                new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(Number(value))
                            }
                        />
                        <Bar
                            dataKey="total"
                            fill="#0f172a"
                            radius={[4, 4, 0, 0]}
                            name="Doanh thu"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// 3. Biểu đồ thiết bị (Pie)
export function DeviceChart({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thiết bị</CardTitle>
                <CardDescription>
                    Tỷ lệ người dùng theo thiết bị.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-75">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
