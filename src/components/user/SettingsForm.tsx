"use client";

import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAccount } from "@/actions/user-actions";
import { handleSignOut } from "@/actions/auth-actions"; // Để logout sau khi xóa
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Moon, Sun, Laptop } from "lucide-react";

export function SettingsForm() {
    const { setTheme, theme } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // Xử lý đổi ngôn ngữ
    const onLanguageChange = (newLocale: string) => {
        // Giả sử logic đổi locale của bạn là thay thế prefix URL
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    // Xử lý xóa tài khoản
    const handleDeleteAccount = () => {
        startTransition(async () => {
            const result = await deleteAccount();
            if (result.success) {
                toast.success("Tài khoản đã bị xóa.");
                await handleSignOut(); // Logout ngay lập tức
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* --- 1. GIAO DIỆN & NGÔN NGỮ --- */}
            <Card>
                <CardHeader>
                    <CardTitle>Hiển thị</CardTitle>
                    <CardDescription>
                        Tùy chỉnh giao diện và ngôn ngữ hiển thị của hệ thống.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Chế độ tối (Dark Mode)</Label>
                            <p className="text-sm text-muted-foreground">
                                Điều chỉnh giao diện sáng/tối.
                            </p>
                        </div>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Chọn giao diện" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun size={14} /> Sáng
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon size={14} /> Tối
                                    </div>
                                </SelectItem>
                                <SelectItem value="system">
                                    <div className="flex items-center gap-2">
                                        <Laptop size={14} /> Hệ thống
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Ngôn ngữ</Label>
                            <p className="text-sm text-muted-foreground">
                                Ngôn ngữ hiển thị chính.
                            </p>
                        </div>
                        <Select value={locale} onValueChange={onLanguageChange}>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Chọn ngôn ngữ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vi">Tiếng Việt</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* --- 2. THÔNG BÁO (Mock UI) --- */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                    <CardDescription>
                        Quản lý các loại email bạn muốn nhận.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Marketing</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận tin tức về các tính năng và bài viết mới.
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Bảo mật</Label>
                            <p className="text-sm text-muted-foreground">
                                Nhận cảnh báo về các hoạt động đăng nhập lạ.
                            </p>
                        </div>
                        <Switch defaultChecked disabled />
                    </div>
                </CardContent>
            </Card>

            {/* --- 3. DANGER ZONE --- */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">
                        Vùng nguy hiểm
                    </CardTitle>
                    <CardDescription>
                        Các hành động này không thể hoàn tác. Hãy cẩn thận.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-foreground">
                                Xóa tài khoản
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên
                                quan.
                            </p>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    Xóa tài khoản
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Bạn có chắc chắn không?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này không thể hoàn tác. Tài
                                        khoản của bạn sẽ bị xóa vĩnh viễn khỏi
                                        hệ thống của chúng tôi.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Hủy bỏ
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive hover:bg-destructive/90"
                                        disabled={isPending}
                                    >
                                        {isPending
                                            ? "Đang xóa..."
                                            : "Xóa vĩnh viễn"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
