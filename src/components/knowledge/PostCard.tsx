import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { IPlainPost } from "@/types/backend";

export function PostCard({ post }: { post: IPlainPost }) {
    return (
        <Card className="p-0 group overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <Link href={`/knowledge/${post.slug}`}>
                    {post.thumbnail?.imgUrl ? (
                        <Image
                            src={post.thumbnail.imgUrl}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </Link>
                {post.category && (
                    <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 backdrop-blur-md bg-background/80 hover:bg-background"
                    >
                        {post.category.name}
                    </Badge>
                )}
            </div>

            <CardContent className="flex-1 p-5">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(post.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                        })}
                    </div>
                    {post.timeRead && (
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {post.timeRead}
                        </div>
                    )}
                </div>

                <Link
                    href={`/knowledge/${post.slug}`}
                    className="block group-hover:text-primary transition-colors"
                >
                    <h3 className="text-xl font-bold leading-tight mb-2 line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.metaDescription}
                </p>
            </CardContent>

            <CardFooter className="p-5 pt-0 mt-auto">
                <Link
                    href={`/knowledge/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline underline-offset-4"
                >
                    Đọc tiếp &rarr;
                </Link>
            </CardFooter>
        </Card>
    );
}
