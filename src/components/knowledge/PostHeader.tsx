"use client";
import Image from "next/image";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IPlainPost } from "@/types/backend";

export function PostHeader({ post }: { post: IPlainPost }) {
    return (
        <header className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {post.category && (
                    <Badge
                        variant="secondary"
                        className="text-primary bg-primary/10 hover:bg-primary/20"
                    >
                        {post.category.name}
                    </Badge>
                )}
                <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(post.createdAt), "dd MMMM, yyyy", {
                        locale: vi,
                    })}
                </span>
                <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.timeRead || "5 min read"}
                </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
                {post.metaDescription}
            </p>

            <div className="flex items-center gap-3 pt-2">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src="/huybooncode.png" />
                    <AvatarFallback>
                        <User />
                    </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                    <p className="font-medium text-foreground">
                        {post.author || "HuyBoon"}
                    </p>
                    <p className="text-muted-foreground text-xs">
                        Frontend Developer
                    </p>
                </div>
            </div>

            {post.thumbnail?.imgUrl && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mt-6 shadow-sm border">
                    <Image
                        src={post.thumbnail.imgUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}
        </header>
    );
}
