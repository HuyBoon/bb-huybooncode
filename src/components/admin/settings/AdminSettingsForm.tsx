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
} from "@/components/ui/card";
import { updateSiteSettings } from "@/actions/admin-settings-actions";
import { toast } from "sonner";
import {
    Loader2,
    Save,
    Globe,
    Share2,
    ShieldAlert,
    FileText,
    UploadCloud,
    CheckCircle2,
} from "lucide-react";
export function AdminSettingsForm({ initialData }: { initialData: any }) {
    const [isPending, startTransition] = useTransition();
    const [cvFile, setCvFile] = useState<string | null>(null);

    const [newFileName, setNewFileName] = useState<string | null>(null);

    const [maintenanceMode, setMaintenanceMode] = useState(
        initialData?.maintenanceMode || false
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "application/pdf") {
                toast.error("Vui lòng chỉ chọn file PDF");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File quá lớn (Max 5MB)");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setCvFile(reader.result as string);
                setNewFileName(file.name);
                toast.success(`Đã chọn: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (formData: FormData) => {
        if (maintenanceMode) formData.set("maintenanceMode", "on");
        else formData.delete("maintenanceMode");

        if (cvFile) formData.set("cvFile", cvFile);

        startTransition(async () => {
            const result = await updateSiteSettings(formData);
            if (result.success) {
                toast.success(result.message);
                setCvFile(null);
                setNewFileName(null);
            } else {
                toast.error(result.error);
            }
        });
    };

    const renderFileStatus = () => {
        if (newFileName) {
            return (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle2 size={16} />
                    <span>Mới: {newFileName}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                        (Chưa lưu)
                    </span>
                </div>
            );
        }

        if (initialData?.cvFile) {
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                        {initialData.cvFileName || "HuyBoon_CV.pdf"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Đang sử dụng trên hệ thống
                    </span>
                </div>
            );
        }

        return (
            <span className="text-muted-foreground italic">
                Chưa tải lên file nào
            </span>
        );
    };

    return (
        <form action={handleSubmit}>
            <Tabs defaultValue="general" className="w-full space-y-4">
                {/* ... (TabsList và các phần trên giữ nguyên) ... */}
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

                <TabsContent value="general" className="space-y-4">
                    {/* ... (Card Thông tin Website giữ nguyên) ... */}
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

                    {/* Card Quản lý CV (ĐÃ UPDATE LOGIC HIỂN THỊ) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quản lý CV</CardTitle>
                            <CardDescription>
                                File này sẽ được tải xuống khi người dùng bấm
                                "My CV".
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 border p-4 rounded-lg bg-muted/20">
                                <div className="p-3 bg-primary/10 rounded-full text-primary">
                                    <FileText size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        File hiện tại
                                    </p>

                                    {/* Gọi hàm render logic hiển thị tên file */}
                                    {renderFileStatus()}
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="cv-upload"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            document
                                                .getElementById("cv-upload")
                                                ?.click()
                                        }
                                    >
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        {cvFile
                                            ? "Chọn file khác"
                                            : "Tải lên / Thay thế"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ... (Các Tabs Socials và System giữ nguyên) ... */}
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

                {/* Submit Button */}
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
