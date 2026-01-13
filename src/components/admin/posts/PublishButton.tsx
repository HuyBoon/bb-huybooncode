"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePostStatus } from "@/actions/post-actions";
import { toast } from "sonner";
import { Globe, Lock, Loader2 } from "lucide-react";

export function PublishButton({
    postId,
    currentStatus,
}: {
    postId: string;
    currentStatus: string;
}) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newStatus = currentStatus === "published" ? "draft" : "published";
        const confirmMsg =
            newStatus === "published"
                ? "Bạn có chắc chắn muốn xuất bản bài viết này?"
                : "Chuyển bài viết về nháp sẽ ẩn nó khỏi website. Tiếp tục?";

        if (!confirm(confirmMsg)) return;

        startTransition(async () => {
            const res = await togglePostStatus(postId, newStatus);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        });
    };

    if (currentStatus === "published") {
        return (
            <Button
                variant="secondary"
                onClick={handleToggle}
                disabled={isPending}
                className="bg-orange-100 text-orange-700 hover:bg-orange-200"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Lock className="mr-2 h-4 w-4" />
                )}
                Gỡ bài (Về nháp)
            </Button>
        );
    }

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Globe className="mr-2 h-4 w-4" />
            )}
            Xuất bản ngay
        </Button>
    );
}
