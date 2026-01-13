"use server";

export async function getAnalyticsData() {
    // 1. Giả lập dữ liệu Traffic 7 ngày qua
    const trafficData = [
        { date: "Mon", visitors: 120, views: 240 },
        { date: "Tue", visitors: 150, views: 300 },
        { date: "Wed", visitors: 180, views: 320 },
        { date: "Thu", visitors: 220, views: 450 },
        { date: "Fri", visitors: 170, views: 390 },
        { date: "Sat", visitors: 140, views: 280 },
        { date: "Sun", visitors: 190, views: 410 },
    ];

    // 2. Giả lập dữ liệu Doanh thu 6 tháng
    const revenueData = [
        { name: "Aug", total: 1500000 },
        { name: "Sep", total: 2300000 },
        { name: "Oct", total: 3200000 },
        { name: "Nov", total: 4500000 },
        { name: "Dec", total: 2100000 },
        { name: "Jan", total: 5600000 },
    ];

    // 3. Giả lập Top Content
    const topContent = [
        { title: "Lộ trình học Next.js 2024", views: 1250, type: "Post" },
        { title: "Wedding Template Pro", views: 980, type: "Template" },
        { title: "HuyBoon Portfolio", views: 850, type: "Project" },
        { title: "Tối ưu SEO với React", views: 620, type: "Post" },
    ];

    // 4. Device Stats
    const deviceData = [
        { name: "Desktop", value: 65, fill: "#2563eb" }, // Blue
        { name: "Mobile", value: 30, fill: "#16a34a" }, // Green
        { name: "Tablet", value: 5, fill: "#f59e0b" }, // Orange
    ];

    return {
        success: true,
        data: {
            trafficData,
            revenueData,
            topContent,
            deviceData,
        },
    };
}
