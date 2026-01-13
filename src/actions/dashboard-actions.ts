"use server";

import connectDB from "@/libs/db";
import Post from "@/models/Post";
import Project from "@/models/Project";
import WebTemplate from "@/models/WebTemplate";
import Category from "@/models/Category";
// import Order from "@/models/Order"; // Chưa có
// import Contact from "@/models/Contact"; // Chưa có

export async function getDashboardStats() {
    try {
        await connectDB();

        // Chạy song song để tối ưu tốc độ
        const [
            totalPosts,
            totalProjects,
            totalTemplates,
            totalCategories,
            recentProjects,
            recentTemplates,
        ] = await Promise.all([
            Post.countDocuments(),
            Project.countDocuments(),
            WebTemplate.countDocuments(),
            Category.countDocuments(),
            // Lấy 5 dự án mới nhất
            Project.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("title status createdAt thumbnail")
                .lean(),
            // Lấy 5 template mới nhất
            WebTemplate.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name price status createdAt thumbnail")
                .lean(),
        ]);

        // Serialize data (Chuyển _id, Date thành string)
        const serialize = (items: any[]) =>
            items.map((item) => ({
                ...item,
                _id: item._id.toString(),
                createdAt: item.createdAt?.toString(),
                thumbnail: item.thumbnail,
            }));

        return {
            success: true,
            stats: {
                posts: totalPosts,
                projects: totalProjects,
                templates: totalTemplates,
                categories: totalCategories,
                orders: 0, // Placeholder
                revenue: 0, // Placeholder
                customers: 0, // Placeholder
            },
            recentActivity: {
                projects: serialize(recentProjects),
                templates: serialize(recentTemplates),
            },
        };
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return { success: false, error: "Lỗi lấy dữ liệu Dashboard" };
    }
}
