"use client";

import { useState, useTransition, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
    Mail,
    MailOpen,
    Trash2,
    Search,
    User,
    MessageSquare,
    Clock,
    ChevronRight,
} from "lucide-react";
import {
    deleteMessage,
    toggleMessageReadStatus,
} from "@/actions/admin-message-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Định nghĩa kiểu dữ liệu cho Message (nếu chưa có file types riêng)
interface MessageType {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export function MessageList({ initialMessages }: { initialMessages: any[] }) {
    const [messages, setMessages] = useState<MessageType[]>(initialMessages);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // 1. Nhóm tin nhắn theo Email và Lọc theo Search
    const threads = useMemo(() => {
        // Bước A: Lọc tin nhắn trước
        const filtered = messages.filter(
            (msg) =>
                msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.message.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Bước B: Nhóm theo Email
        const groups: Record<string, MessageType[]> = {};
        filtered.forEach((msg) => {
            if (!groups[msg.email]) {
                groups[msg.email] = [];
            }
            groups[msg.email].push(msg);
        });

        // Bước C: Chuyển về dạng mảng và Sắp xếp theo tin nhắn mới nhất
        return Object.entries(groups)
            .map(([email, msgs]) => {
                // Sắp xếp tin trong nhóm theo thời gian (Mới nhất nằm dưới cùng - giống chat)
                msgs.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );

                const latestMsg = msgs[msgs.length - 1]; // Tin mới nhất để hiển thị preview
                const unreadCount = msgs.filter((m) => !m.isRead).length;

                return {
                    email,
                    name: latestMsg.name, // Lấy tên từ tin mới nhất
                    messages: msgs,
                    latestMsg,
                    unreadCount,
                    lastActive: new Date(latestMsg.createdAt).getTime(),
                };
            })
            .sort((a, b) => b.lastActive - a.lastActive); // Thread mới nhất lên đầu
    }, [messages, searchTerm]);

    // Tự động chọn thread đầu tiên nếu chưa chọn gì (trên Desktop)
    /* useEffect(() => {
        if (!selectedEmail && threads.length > 0 && window.innerWidth >= 768) {
             setSelectedEmail(threads[0].email);
        }
    }, [threads, selectedEmail]); */

    // --- ACTIONS ---

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;
        startTransition(async () => {
            const res = await deleteMessage(id);
            if (res.success) {
                toast.success(res.message);
                setMessages((prev) => prev.filter((m) => m._id !== id));
                // Nếu xóa hết tin của người đang chọn, reset selection
                const isCurrentThreadEmpty =
                    messages.filter(
                        (m) => m.email === selectedEmail && m._id !== id
                    ).length === 0;
                if (isCurrentThreadEmpty) setSelectedEmail(null);
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

    // Lấy dữ liệu của thread đang chọn
    const activeThread = threads.find((t) => t.email === selectedEmail);

    return (
        <div className="flex flex-col h-175 border rounded-lg overflow-hidden bg-background shadow-sm md:flex-row">
            {/* --- CỘT TRÁI: DANH SÁCH NGƯỜI GỬI --- */}
            <div
                className={cn(
                    "w-full md:w-87.5 flex flex-col border-r bg-muted/10",
                    selectedEmail ? "hidden md:flex" : "flex" // Mobile logic: Ẩn danh sách khi đã chọn
                )}
            >
                {/* Search Header */}
                <div className="p-4 border-b bg-background">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm tin nhắn..."
                            className="pl-8 bg-muted/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Thread List */}
                <ScrollArea className="flex-1">
                    {threads.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Không tìm thấy tin nhắn nào.
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {threads.map((thread) => (
                                <button
                                    key={thread.email}
                                    onClick={() =>
                                        setSelectedEmail(thread.email)
                                    }
                                    className={cn(
                                        "flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 border-b border-border/40 last:border-0",
                                        selectedEmail === thread.email &&
                                            "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                                    )}
                                >
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarFallback
                                            className={cn(
                                                "font-bold text-xs",
                                                thread.unreadCount > 0
                                                    ? "bg-primary/10 text-primary"
                                                    : ""
                                            )}
                                        >
                                            {thread.name[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between mb-1">
                                            <span
                                                className={cn(
                                                    "font-medium truncate max-w-35",
                                                    thread.unreadCount > 0 &&
                                                        "text-foreground font-bold"
                                                )}
                                            >
                                                {thread.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(
                                                    new Date(thread.lastActive),
                                                    {
                                                        addSuffix: false,
                                                        locale: vi,
                                                    }
                                                ).replace("khoảng ", "")}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p
                                                className={cn(
                                                    "text-xs truncate max-w-45",
                                                    thread.unreadCount > 0
                                                        ? "text-foreground font-medium"
                                                        : "text-muted-foreground"
                                                )}
                                            >
                                                {thread.latestMsg.message}
                                            </p>
                                            {thread.unreadCount > 0 && (
                                                <Badge className="h-5 px-1.5 min-w-5 flex items-center justify-center rounded-full text-[10px]">
                                                    {thread.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* --- CỘT PHẢI: CHI TIẾT HỘI THOẠI --- */}
            <div
                className={cn(
                    "flex-1 flex flex-col bg-background",
                    !selectedEmail ? "hidden md:flex" : "flex"
                )}
            >
                {activeThread ? (
                    <>
                        {/* Header Hội thoại */}
                        <div className="flex items-center justify-between p-4 border-b h-17.25">
                            <div className="flex items-center gap-3">
                                {/* Back button for Mobile */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2"
                                    onClick={() => setSelectedEmail(null)}
                                >
                                    <ChevronRight className="rotate-180 h-5 w-5" />
                                </Button>

                                <div className="flex flex-col">
                                    <h3 className="font-bold flex items-center gap-2">
                                        {activeThread.name}
                                        <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                                            {activeThread.messages.length} tin
                                            nhắn
                                        </span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail size={10} /> {activeThread.email}
                                    </p>
                                </div>
                            </div>

                            {/* Global Action cho Thread (Ví dụ: Mark all read - tính năng này cần bổ sung API sau) */}
                            <Button variant="outline" size="sm" asChild>
                                <a href={`mailto:${activeThread.email}`}>
                                    Trả lời Email
                                </a>
                            </Button>
                        </div>

                        {/* Nội dung tin nhắn (Chat View) */}
                        <ScrollArea className="flex-1 p-4 bg-muted/5">
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {activeThread.messages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className="group relative flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    >
                                        <Avatar className="h-8 w-8 mt-1 border border-border/50">
                                            <AvatarFallback className="text-[10px] bg-background">
                                                {msg.name[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {formatDistanceToNow(
                                                        new Date(msg.createdAt),
                                                        {
                                                            addSuffix: true,
                                                            locale: vi,
                                                        }
                                                    )}
                                                </span>
                                                {!msg.isRead && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[9px] h-4 px-1 bg-blue-100 text-blue-700 hover:bg-blue-100 border-0"
                                                    >
                                                        Chưa đọc
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* BONG BÓNG CHAT */}
                                            <div
                                                className={cn(
                                                    "p-4 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed whitespace-pre-wrap border",
                                                    !msg.isRead
                                                        ? "bg-white border-primary/20 shadow-primary/5 ring-1 ring-primary/10 dark:bg-card"
                                                        : "bg-card border-border/40 text-muted-foreground/90"
                                                )}
                                            >
                                                {msg.message}
                                            </div>

                                            {/* Actions từng tin nhắn */}
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary"
                                                    onClick={() =>
                                                        handleToggleRead(
                                                            msg._id,
                                                            msg.isRead
                                                        )
                                                    }
                                                >
                                                    {msg.isRead ? (
                                                        <Mail
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                    ) : (
                                                        <MailOpen
                                                            size={12}
                                                            className="mr-1"
                                                        />
                                                    )}
                                                    {msg.isRead
                                                        ? "Đánh dấu chưa đọc"
                                                        : "Đã đọc"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] px-2 text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(msg._id)
                                                    }
                                                >
                                                    <Trash2
                                                        size={12}
                                                        className="mr-1"
                                                    />{" "}
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    // Trạng thái chờ (Empty State)
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                        <div className="p-6 bg-muted/30 rounded-full">
                            <MessageSquare size={48} className="opacity-20" />
                        </div>
                        <p>Chọn một cuộc hội thoại để xem chi tiết</p>
                    </div>
                )}
            </div>
        </div>
    );
}
