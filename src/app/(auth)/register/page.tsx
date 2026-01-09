"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { register } from "@/actions/auth-actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(register, undefined);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            router.push("/login");
        }
    }, [state, router]);

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            <div className="flex items-center justify-center p-8 md:p-12 bg-background order-2 lg:order-1">
                <div className="mx-auto w-full max-w-112.5 space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        {/* ... Header giữ nguyên ... */}
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Tạo tài khoản mới
                        </h1>
                        {/* ... */}
                    </div>

                    <form action={formAction} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="name">Họ và tên</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nguyễn Văn A"
                                    required
                                    disabled={isPending}
                                    className="h-11"
                                    defaultValue={state?.inputs?.name}
                                />
                                {state?.error?.name && (
                                    <p className="text-xs text-destructive font-medium">
                                        {state.error.name[0]}
                                    </p>
                                )}
                            </div>
                        </div>

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
                                defaultValue={state?.inputs?.email}
                            />
                            {state?.error?.email && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.error.email[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isPending}
                                className="h-11"
                            />
                            {state?.error?.password && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.error.password[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Nhập lại mật khẩu
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                disabled={isPending}
                                className="h-11"
                            />
                            {state?.error?.confirmPassword && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.error.confirmPassword[0]}
                                </p>
                            )}
                        </div>

                        {state?.message && !state?.success && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in-50">
                                {state.message}
                            </div>
                        )}

                        <SubmitButton className="w-full h-11 text-base">
                            Đăng ký tài khoản
                        </SubmitButton>
                    </form>

                    {/* ... Footer link giữ nguyên ... */}
                    <div className="text-center text-sm text-muted-foreground">
                        Đã có tài khoản?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline font-medium transition-colors"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>

            {/* ... Phần Hình Ảnh giữ nguyên ... */}
            <div className="hidden lg:block relative h-full w-full bg-muted order-1 lg:order-2">
                <Image
                    src="/huybooncode.png"
                    alt="Register background"
                    fill
                    className="object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
                    priority
                />
                <div className="absolute bottom-10 right-10 z-20 text-white text-right">
                    <h2 className="text-3xl font-bold">Bắt đầu hành trình.</h2>
                    <p className="text-lg opacity-90">
                        Tham gia cùng hàng ngàn nhà phát triển khác.
                    </p>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
            </div>
        </div>
    );
}
