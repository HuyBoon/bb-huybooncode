"use client";

import { useTransition } from "react";
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
import { updateProfile } from "@/actions/user-actions"; // Tái sử dụng Action của User
import { Loader2, Save } from "lucide-react";

interface AdminProfileFormProps {
    user: {
        name: string;
        email: string;
    };
}

export function AdminProfileForm({ user }: AdminProfileFormProps) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateProfile(formData);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form action={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin quản trị viên</CardTitle>
                    <CardDescription>
                        Cập nhật tên hiển thị của bạn. Email quản trị không thể
                        thay đổi tại đây.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            placeholder="Nhập tên hiển thị"
                            minLength={2}
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Lưu thay đổi
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
