"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { updateSiteSettings } from "@/actions/admin-settings-actions";
import { toast } from "sonner";
import { Loader2, Save, Globe, Share2, ShieldAlert } from "lucide-react";

export function AdminSettingsForm({ initialData }: { initialData: any }) {
    const [isPending, startTransition] = useTransition();
    // State riêng cho switch vì switch của shadcn không dùng name attribute trực tiếp như input native
    const [maintenanceMode, setMaintenanceMode] = useState(
        initialData?.maintenanceMode || false
    );

    const handleSubmit = (formData: FormData) => {
        // Append giá trị của switch vào formData thủ công
        if (maintenanceMode) {
            formData.set("maintenanceMode", "on");
        } else {
            formData.delete("maintenanceMode");
        }

        startTransition(async () => {
            const result = await updateSiteSettings(formData);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <form action={handleSubmit}>
            <Tabs defaultValue="general" className="w-full space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <Globe size={16} /> Chung
                    </TabsTrigger>
                    <TabsTrigger value="socials" className="gap-2">
                        <Share2 size={16} /> Mạng xã hội
                    </TabsTrigger>
                    <TabsTrigger value="system" className="gap-2">
                        <ShieldAlert size={16} /> Hệ thống
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB: GENERAL --- */}
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin Website</CardTitle>
                            <CardDescription>
                                Cấu hình các thẻ meta và thông tin cơ bản.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Tên Website</Label>
                                <Input
                                    id="siteName"
                                    name="siteName"
                                    defaultValue={initialData?.siteName}
                                    placeholder="HuyBoonTech"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">
                                    Mô tả (SEO Description)
                                </Label>
                                <Textarea
                                    id="siteDescription"
                                    name="siteDescription"
                                    defaultValue={initialData?.siteDescription}
                                    placeholder="Mô tả ngắn về website..."
                                    rows={4}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">
                                    Email liên hệ
                                </Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    defaultValue={initialData?.contactEmail}
                                    placeholder="contact@huyboon.tech"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB: SOCIALS --- */}
                <TabsContent value="socials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Liên kết xã hội</CardTitle>
                            <CardDescription>
                                Các đường dẫn này sẽ hiển thị ở Footer và
                                Header.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub URL</Label>
                                <Input
                                    id="github"
                                    name="github"
                                    defaultValue={initialData?.socials?.github}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn URL</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    defaultValue={
                                        initialData?.socials?.linkedin
                                    }
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook URL</Label>
                                <Input
                                    id="facebook"
                                    name="facebook"
                                    defaultValue={
                                        initialData?.socials?.facebook
                                    }
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB: SYSTEM --- */}
                <TabsContent value="system">
                    <Card className="border-orange-500/50">
                        <CardHeader>
                            <CardTitle className="text-orange-600">
                                Trạng thái hệ thống
                            </CardTitle>
                            <CardDescription>
                                Kiểm soát khả năng truy cập của người dùng.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                                <div className="space-y-0.5">
                                    <Label className="text-base">
                                        Chế độ bảo trì
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Khi bật, người dùng (trừ Admin) sẽ thấy
                                        trang "Đang bảo trì".
                                    </p>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onCheckedChange={setMaintenanceMode}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- SUBMIT BUTTON --- */}
                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Lưu cấu hình
                            </>
                        )}
                    </Button>
                </div>
            </Tabs>
        </form>
    );
}
