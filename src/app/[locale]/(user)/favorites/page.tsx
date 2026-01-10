import { auth } from "@/auth";
import connectDB from "@/libs/db";
import User from "@/models/User";
import { FavoriteCard } from "@/components/user/FavoriteCard";
import { HeartOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

// Giả lập Fetch Data (Bạn thay bằng truy vấn Mongoose thật)
async function getFavoritePosts(userId: string) {
    await connectDB();

    // Tìm user và populate savedPosts
    // const user = await User.findById(userId).populate('savedPosts').lean();
    // return user?.savedPosts || [];

    // --- MOCK DATA (Xóa khi có DB thật) ---
    return [
        {
            _id: "1",
            title: "Tối ưu hóa Next.js 15 với Turbopack",
            slug: "nextjs-optimization",
            excerpt:
                "Hướng dẫn chi tiết cách giảm thời gian build và tăng tốc độ tải trang bằng các kỹ thuật mới nhất.",
            coverImage: "/huybooncode.png",

            category: "Tech",
            createdAt: "2024-01-15",
            readTime: "5 phút đọc",
        },
        {
            _id: "2",
            title: "Lộ trình Frontend Developer 2025",
            slug: "frontend-roadmap-2025",
            excerpt:
                "Những kỹ năng quan trọng bạn cần nắm bắt để không bị đào thải trong kỷ nguyên AI.",
            coverImage: "/huybooncode.png",

            category: "Career",
            createdAt: "2024-02-10",
            readTime: "10 phút đọc",
        },
    ];
}

export default async function FavoritesPage() {
    const session = await auth();
    const posts = await getFavoritePosts(session?.user?.id as string);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Bài viết đã lưu
                </h1>
                <p className="text-muted-foreground">
                    Danh sách các bài viết bạn đã đánh dấu để đọc lại sau.
                </p>
            </div>

            {/* Content */}
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <FavoriteCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center min-h-100 border-2 border-dashed rounded-xl bg-muted/30 text-center px-4">
                    <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                        <HeartOff className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        Chưa có bài viết nào
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                        Bạn chưa lưu bài viết nào cả. Hãy khám phá Blog và lưu
                        lại những kiến thức bổ ích nhé!
                    </p>
                    <Button asChild>
                        <Link href="/blog">Khám phá Blog ngay</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
