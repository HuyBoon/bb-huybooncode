"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { changePassword } from "@/actions/user-actions";
import { Loader2, Eye, EyeOff, Save } from "lucide-react";

export function ChangePasswordForm() {
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await changePassword(formData);
            if (result.success) {
                toast.success(result.message);
                formRef.current?.reset();
            } else {
                toast.error(result.error);
            }
        });
    };

    // --- Component con Input Password đã sửa lỗi ---
    const PasswordInput = ({
        id,
        label,
        name,
        isVisible,
        toggleVisibility,
    }: {
        id: string;
        label: string;
        name: string;
        isVisible: boolean;
        toggleVisibility: () => void;
    }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    name={name}
                    // Chuyển đổi giữa text và password dựa trên state
                    type={isVisible ? "text" : "password"}
                    placeholder="••••••"
                    className="pr-10"
                />
                <button
                    // 👇👇👇 QUAN TRỌNG NHẤT: Phải có type="button" ở đây 👇👇👇
                    type="button"
                    // 👆👆👆 Nếu thiếu dòng này, nó sẽ biến thành nút submit form 👆👆👆

                    onClick={toggleVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1} // Ngăn không cho người dùng tab vào icon này
                    aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"} // Tốt cho accessibility
                >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
    // --------------------------------------------------

    return (
        <form ref={formRef} action={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>
                        Hãy sử dụng mật khẩu mạnh gồm chữ hoa, chữ thường và số.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PasswordInput
                        id="current"
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        isVisible={showCurrent}
                        toggleVisibility={() => setShowCurrent(!showCurrent)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PasswordInput
                            id="new"
                            name="newPassword"
                            label="Mật khẩu mới"
                            isVisible={showNew}
                            toggleVisibility={() => setShowNew(!showNew)}
                        />
                        <PasswordInput
                            id="confirm"
                            name="confirmPassword"
                            label="Nhập lại mật khẩu mới"
                            isVisible={showConfirm}
                            toggleVisibility={() =>
                                setShowConfirm(!showConfirm)
                            }
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    {/* Chỉ có nút này mới nên là nút submit */}
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Cập nhật mật
                                khẩu
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
