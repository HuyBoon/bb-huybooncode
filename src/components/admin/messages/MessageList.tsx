"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Search, CheckCircle2 } from "lucide-react";
import {
    deleteMessage,
    toggleMessageReadStatus,
} from "@/actions/admin-message-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function MessageList({ initialMessages }: { initialMessages: any[] }) {
    const [messages, setMessages] = useState(initialMessages);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();

    // Lọc tin nhắn
    const filteredMessages = messages.filter(
        (msg) =>
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;

        startTransition(async () => {
            const res = await deleteMessage(id);
            if (res.success) {
                toast.success(res.message);
                setMessages((prev) => prev.filter((m) => m._id !== id));
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleToggleRead = (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleMessageReadStatus(id, currentStatus);
            setMessages((prev) =>
                prev.map((m) =>
                    m._id === id ? { ...m, isRead: !currentStatus } : m
                )
            );
        });
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm theo tên, email hoặc nội dung..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <ScrollArea className="h-150 rounded-md border p-4">
                {filteredMessages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        Chưa có tin nhắn nào.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg._id}
                                className={cn(
                                    "flex flex-col gap-2 rounded-lg border p-4 transition-all hover:bg-muted/50",
                                    !msg.isRead
                                        ? "bg-primary/5 border-primary/20"
                                        : "bg-card"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "p-2 rounded-full",
                                                !msg.isRead
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {msg.isRead ? (
                                                <MailOpen size={16} />
                                            ) : (
                                                <Mail size={16} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4
                                                    className={cn(
                                                        "text-sm font-semibold",
                                                        !msg.isRead &&
                                                            "text-primary"
                                                    )}
                                                >
                                                    {msg.name}
                                                </h4>
                                                {!msg.isRead && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="text-[10px] h-4 px-1"
                                                    >
                                                        Mới
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {msg.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(
                                            new Date(msg.createdAt),
                                            { addSuffix: true, locale: vi }
                                        )}
                                    </span>
                                </div>

                                <div className="mt-2 text-sm text-foreground/80 bg-background/50 p-3 rounded-md border border-border/50">
                                    {msg.message}
                                </div>

                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleToggleRead(
                                                msg._id,
                                                msg.isRead
                                            )
                                        }
                                        className="h-8 text-xs"
                                    >
                                        {msg.isRead
                                            ? "Đánh dấu chưa đọc"
                                            : "Đã đọc"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(msg._id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
