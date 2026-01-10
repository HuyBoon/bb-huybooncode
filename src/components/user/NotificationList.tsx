"use client";

import { useState } from "react";
import {
    Check,
    Trash2,
    Bell,
    Info,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    BellOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { NotificationItem, NotificationType } from "@/types";

// Hàm helper để lấy icon theo loại thông báo
const getIcon = (type: NotificationType) => {
    switch (type) {
        case "success":
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case "warning":
            return <AlertTriangle className="h-5 w-5 text-orange-500" />;
        case "error":
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <Info className="h-5 w-5 text-blue-500" />;
    }
};

interface NotificationListProps {
    initialData: NotificationItem[];
}

export function NotificationList({ initialData }: NotificationListProps) {
    const [notifications, setNotifications] =
        useState<NotificationItem[]>(initialData);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    // Lọc danh sách hiển thị
    const filteredNotifications = notifications.filter((item) => {
        if (filter === "unread") return !item.isRead;
        return true;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // Actions
    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        // TODO: Call Server Action update DB
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        // TODO: Call Server Action update DB
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        // TODO: Call Server Action delete DB
    };

    return (
        <Card className="min-h-150 flex flex-col">
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Thông báo
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="rounded-full px-2 text-xs"
                                >
                                    {unreadCount} mới
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Quản lý các cập nhật quan trọng từ hệ thống.
                        </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                        >
                            <Check className="mr-2 h-4 w-4" /> Đánh dấu đã đọc
                            hết
                        </Button>
                    )}
                </div>

                <div className="pt-4">
                    <Tabs
                        defaultValue="all"
                        onValueChange={(v) => setFilter(v as "all" | "unread")}
                    >
                        <TabsList>
                            <TabsTrigger value="all">Tất cả</TabsTrigger>
                            <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-2">
                        <AnimatePresence initial={false}>
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                        marginBottom: 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className={cn(
                                            "relative flex items-start gap-4 p-4 rounded-xl border transition-all hover:bg-muted/50",
                                            !notification.isRead
                                                ? "bg-primary/5 border-primary/20"
                                                : "bg-card"
                                        )}
                                    >
                                        <div className="mt-1 shrink-0">
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-start justify-between">
                                                <p
                                                    className={cn(
                                                        "text-sm font-medium leading-none",
                                                        !notification.isRead &&
                                                            "font-bold text-foreground"
                                                    )}
                                                >
                                                    {notification.title}
                                                </p>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            notification.createdAt
                                                        ),
                                                        {
                                                            addSuffix: true,
                                                            locale: vi,
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>

                                        {/* Actions Hover */}
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 sm:static sm:opacity-100">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-primary"
                                                    title="Đánh dấu đã đọc"
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                title="Xóa thông báo"
                                                onClick={() =>
                                                    deleteNotification(
                                                        notification.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center h-75 text-center space-y-3">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                            <BellOff className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">
                            Không có thông báo nào
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {filter === "unread"
                                ? "Tuyệt vời! Bạn đã đọc hết tất cả thông báo."
                                : "Hiện tại bạn chưa có thông báo nào từ hệ thống."}
                        </p>
                    </div>
                )}
            </ScrollArea>
        </Card>
    );
}
