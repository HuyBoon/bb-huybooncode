"use client";

import { useState, useTransition } from "react";
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
import { updateProfile } from "@/actions/user-actions";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
    user: {
        name: string;
        email: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
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
                    <CardTitle>Thông tin chung</CardTitle>
                    <CardDescription>
                        Cập nhật tên hiển thị của bạn. Email không thể thay đổi.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            placeholder="Nhập tên của bạn"
                            minLength={2}
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Lưu thay đổi
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
