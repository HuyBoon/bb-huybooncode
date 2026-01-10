"use client";

import Image from "next/image";

import { Calendar, Clock, ArrowRight, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { removeFavorite } from "@/actions/user-actions";
import { useTransition } from "react";
import Link from "next/link";

// Interface này nên để trong file types.ts dùng chung
interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    category: string;
    createdAt: string; // Hoặc Date
    readTime: string;
}

export function FavoriteCard({ post }: { post: Post }) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = () => {
        startTransition(async () => {
            const result = await removeFavorite(post._id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Card className="group flex flex-col h-full overflow-hidden border-muted/60 transition-all hover:shadow-lg hover:border-primary/50">
            {/* Ảnh bìa */}
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={post.coverImage || "/placeholder.jpg"} // Ảnh fallback
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background/90">
                    {post.category}
                </Badge>
            </div>

            {/* Nội dung */}
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                    </div>
                </div>
                <Link
                    href={`/blog/${post.slug}`}
                    className="hover:underline decoration-primary underline-offset-4"
                >
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>
            </CardHeader>

            <CardContent className="p-4 pt-2 grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <Button
                    variant="link"
                    asChild
                    className="p-0 h-auto font-semibold text-primary"
                >
                    <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-1"
                    >
                        Đọc tiếp <ArrowRight size={16} />
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={handleRemove}
                    disabled={isPending}
                >
                    <Trash2 size={18} />
                </Button>
            </CardFooter>
        </Card>
    );
}
