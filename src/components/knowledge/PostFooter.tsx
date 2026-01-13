"use client"; // Chuyển thành Client Component để dùng onClick

import { useState } from "react";
import { Tag, Share2, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostFooterProps {
    tags: string[];
    title: string;
}

export function PostFooter({ tags, title }: PostFooterProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        // 1. Ưu tiên dùng Native Share của trình duyệt (Mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Đọc bài viết "${title}" trên HuyBoon Code`,
                    url: url,
                });
            } catch (error) {
                console.log("User cancelled share");
            }
        } else {
            // 2. Fallback: Copy link vào clipboard (Desktop)
            try {
                await navigator.clipboard.writeText(url);
                setIsCopied(true);
                toast.success("Đã sao chép liên kết bài viết!");

                // Reset icon sau 2 giây
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                toast.error("Không thể sao chép liên kết.");
            }
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-10 pt-6 border-t">
            <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} className="text-muted-foreground" />
                {tags && tags.length > 0 ? (
                    tags.map((tag, idx) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                            #{tag}
                        </Badge>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground">
                        Không có thẻ
                    </span>
                )}
            </div>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 min-w-25"
                            onClick={handleShare}
                        >
                            {isCopied ? (
                                <Check size={16} className="text-green-600" />
                            ) : (
                                <Share2 size={16} />
                            )}
                            {isCopied ? "Đã chép" : "Chia sẻ"}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Chia sẻ bài viết này</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
