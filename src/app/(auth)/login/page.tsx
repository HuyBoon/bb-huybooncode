"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authenticate } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    // Đổi tên biến errorMessage thành state vì giờ nó là object
    const [state, formAction, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* ... Phần hình ảnh giữ nguyên ... */}
            <div className="hidden lg:block relative h-full w-full bg-muted">
                <Image
                    src="/huybooncode.png"
                    alt="Login background"
                    fill
                    className="object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
                    priority
                />
                <div className="absolute bottom-10 left-10 z-20 text-white">
                    <h2 className="text-3xl font-bold">Chào mừng trở lại.</h2>
                    <p className="text-lg opacity-90">
                        Tiếp tục xây dựng những điều tuyệt vời.
                    </p>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
            </div>

            {/* --- CỘT PHẢI: FORM LOGIN --- */}
            <div className="flex items-center justify-center p-8 md:p-12 bg-background">
                <div className="mx-auto w-full max-w-100 space-y-6">
                    {/* ... Header giữ nguyên ... */}
                    <div className="flex flex-col space-y-2 text-center">
                        <Link
                            href="/"
                            className="text-2xl font-bold flex items-center justify-center gap-1"
                        >
                            <span className="text-primary">&lt;</span>
                            HuyBoonTech
                            <span className="text-primary">/&gt;</span>
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Đăng nhập hệ thống
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Nhập email và mật khẩu của bạn để tiếp tục
                        </p>
                    </div>

                    {/* Form */}
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                disabled={isPending}
                                className="h-11"
                                // THÊM DÒNG NÀY: Giữ lại email cũ nếu đăng nhập sai
                                defaultValue={state?.inputs?.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal text-xs"
                                    type="button"
                                >
                                    Quên mật khẩu?
                                </Button>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isPending}
                                className="h-11"
                                // Mật khẩu thì KHÔNG bao giờ nên giữ lại (defaultValue)
                            />
                        </div>

                        {/* Hiển thị lỗi từ state.message */}
                        {state?.message && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in-50">
                                {state.message}
                            </div>
                        )}

                        <SubmitButton className="w-full h-11 text-base">
                            Đăng nhập
                        </SubmitButton>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Chưa có tài khoản?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:underline font-medium transition-colors"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
