"use client";

import { useState, useRef, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import slugify from "slugify";
import {
    Loader2,
    Save,
    ArrowLeft,
    UploadCloud,
    X,
    Star,
    Trash2,
} from "lucide-react";

import {
    createProject,
    updateProject,
    deleteProjectGalleryImage,
} from "@/actions/project-actions";
import { uploadImageToCloudinary } from "@/actions/image-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPlainCategory, IPlainProject } from "@/types/backend";

const CKEditorPro = dynamic(
    () => import("@/components/admin/editor/CKEditorPro"),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 w-full bg-muted/20 animate-pulse rounded-md" />
        ),
    }
);

interface ProjectFormProps {
    categories: IPlainCategory[];
    initialData?: IPlainProject;
}

export function ProjectForm({ categories, initialData }: ProjectFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Refs
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    // Tech Stack Input
    const [techInput, setTechInput] = useState("");

    // Form State
    const [form, setFormState] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        shortDescription: initialData?.shortDescription || "",
        description: initialData?.description || "",
        category: initialData?.category?._id || "",
        client: initialData?.client || "",
        demoUrl: initialData?.demoUrl || "",
        repoUrl: initialData?.repoUrl || "",
        status: initialData?.status || "completed",
        isFeatured: initialData?.isFeatured || false,
        techStack: initialData?.techStack || [],

        // Thumbnail
        thumbnailUrl: initialData?.thumbnail?.imgUrl || "",
        thumbnailPublicId: initialData?.thumbnail?.public_id || "",

        // Gallery (Existing)
        gallery: initialData?.gallery || [],
        // New Gallery Files (Files to upload)
        newGalleryFiles: [] as File[],
    });

    const setForm = (newData: Partial<typeof form>) =>
        setFormState((prev) => ({ ...prev, ...newData }));
    const generateSlug = (val: string) =>
        slugify(val, { lower: true, strict: true, locale: "vi" });

    // --- Handlers ---

    // 1. Tech Stack
    const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const val = techInput.trim();
            if (val && !form.techStack.includes(val)) {
                setForm({ techStack: [...form.techStack, val] });
            }
            setTechInput("");
        }
    };
    const removeTech = (t: string) =>
        setForm({ techStack: form.techStack.filter((i) => i !== t) });

    // 2. Thumbnail Upload (Direct Cloudinary for Preview)
    const handleThumbnailChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Đang tải thumbnail...");
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImageToCloudinary(formData);
        if (res.success && res.url) {
            setForm({
                thumbnailUrl: res.url,
                thumbnailPublicId: res.public_id,
            });
            toast.success("Xong!", { id: toastId });
        } else {
            toast.error("Lỗi upload", { id: toastId });
        }
    };

    // 3. Gallery Selection (Local Preview only, upload later)
    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setForm({ newGalleryFiles: [...form.newGalleryFiles, ...files] });
        }
    };
    const removeNewGalleryFile = (idx: number) => {
        setForm({
            newGalleryFiles: form.newGalleryFiles.filter((_, i) => i !== idx),
        });
    };
    const removeExistingGalleryImage = async (publicId: string) => {
        if (!initialData) return;
        if (!confirm("Xóa ảnh này khỏi thư viện?")) return;

        const res = await deleteProjectGalleryImage(initialData._id, publicId);
        if (res.success) {
            setForm({
                gallery: form.gallery.filter(
                    (img) => img.public_id !== publicId
                ),
            });
            toast.success("Đã xóa ảnh");
        } else {
            toast.error("Lỗi xóa ảnh");
        }
    };

    // 4. Submit
    const handleSubmit = async () => {
        if (!form.title || !form.thumbnailUrl || !form.category) {
            toast.error(
                "Thiếu thông tin bắt buộc (Tiêu đề, Ảnh bìa, Danh mục)"
            );
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("slug", form.slug || generateSlug(form.title));
        formData.append("shortDescription", form.shortDescription);
        formData.append("category", form.category);
        formData.append("client", form.client);
        formData.append("demoUrl", form.demoUrl);
        formData.append("repoUrl", form.repoUrl);
        formData.append("status", form.status);
        formData.append("isFeatured", String(form.isFeatured));
        formData.append("techStack", form.techStack.join(","));

        if (initialData) formData.append("id", initialData._id);

        startTransition(async () => {
            // A. Upload New Gallery Files
            const newGalleryData: { url: string; public_id: string }[] = [];
            if (form.newGalleryFiles.length > 0) {
                const uploadPromises = form.newGalleryFiles.map((file) => {
                    const fd = new FormData();
                    fd.append("file", file);
                    return uploadImageToCloudinary(fd);
                });

                const results = await Promise.all(uploadPromises);
                results.forEach((res) => {
                    if (res.success && res.url)
                        newGalleryData.push({
                            url: res.url,
                            public_id: res.public_id,
                        });
                });
            }

            // B. Call Server Action
            const thumbnailData = {
                url: form.thumbnailUrl,
                public_id: form.thumbnailPublicId,
            };

            let result;
            if (initialData) {
                result = await updateProject(
                    formData,
                    form.description,
                    thumbnailData,
                    newGalleryData
                );
            } else {
                result = await createProject(
                    formData,
                    form.description,
                    thumbnailData,
                    newGalleryData
                );
            }

            if (result.success) {
                toast.success(result.message);
                router.push("/admin/projects");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header Sticky */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b -mx-6 -mt-6 mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-xl font-bold">
                        {initialData ? "Sửa dự án" : "Thêm dự án mới"}
                    </h1>
                </div>
                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Save className="mr-2" />
                    )}
                    {initialData ? "Cập nhật" : "Lưu dự án"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- CỘT TRÁI (Main Info) --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin cơ bản</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tên dự án</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => {
                                        setForm({ title: e.target.value });
                                        if (!initialData)
                                            setForm({
                                                slug: generateSlug(
                                                    e.target.value
                                                ),
                                            });
                                    }}
                                    className="text-lg font-bold"
                                />
                            </div>
                            <div>
                                <Label>Slug</Label>
                                <Input
                                    value={form.slug}
                                    onChange={(e) =>
                                        setForm({
                                            slug: generateSlug(e.target.value),
                                        })
                                    }
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div>
                                <Label>Mô tả ngắn (Card)</Label>
                                <Textarea
                                    rows={3}
                                    value={form.shortDescription}
                                    onChange={(e) =>
                                        setForm({
                                            shortDescription: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Chi tiết & Gallery</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Editor */}
                            <div>
                                <Label className="mb-2 block">
                                    Nội dung chi tiết (Case Study)
                                </Label>
                                <div className="border rounded-md">
                                    <CKEditorPro
                                        content={form.description}
                                        onChange={(html) =>
                                            setForm({ description: html })
                                        }
                                        onUploadImage={async (file) => {
                                            const fd = new FormData();
                                            fd.append("file", file);
                                            const res =
                                                await uploadImageToCloudinary(
                                                    fd
                                                );
                                            if (res.success && res.url)
                                                return res.url;
                                            throw new Error("Fail");
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Gallery */}
                            <div>
                                <Label className="mb-2 block">
                                    Thư viện ảnh (Gallery)
                                </Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                                    {/* Existing Images */}
                                    {form.gallery.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square rounded-md overflow-hidden border group"
                                        >
                                            <Image
                                                src={img.imgUrl}
                                                alt="Gallery"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        removeExistingGalleryImage(
                                                            img.public_id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {/* New Images Preview */}
                                    {form.newGalleryFiles.map((file, idx) => (
                                        <div
                                            key={`new-${idx}`}
                                            className="relative aspect-square rounded-md overflow-hidden border group"
                                        >
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt="New"
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                            <div className="absolute top-1 right-1">
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px]"
                                                >
                                                    New
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    removeNewGalleryFile(idx)
                                                }
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                    {/* Upload Button */}
                                    <div
                                        className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() =>
                                            galleryInputRef.current?.click()
                                        }
                                    >
                                        <UploadCloud className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">
                                            Thêm ảnh
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        hidden
                                        ref={galleryInputRef}
                                        onChange={handleGallerySelect}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- CỘT PHẢI (Settings) --- */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Trạng thái */}
                            <div className="space-y-2">
                                <Label>Trạng thái</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) =>
                                        setForm({ status: v as any })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="completed">
                                            Hoàn thành
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                            Đang thực hiện
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Is Featured */}
                            <div className="flex items-center justify-between border p-3 rounded-md">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Nổi bật</Label>
                                    <div className="text-xs text-muted-foreground">
                                        Hiện lên trang chủ
                                    </div>
                                </div>
                                <Switch
                                    checked={form.isFeatured}
                                    onCheckedChange={(c) =>
                                        setForm({ isFeatured: c })
                                    }
                                />
                            </div>

                            {/* Danh mục (Filter type='project') */}
                            <div className="space-y-2">
                                <Label>
                                    Danh mục{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(v) =>
                                        setForm({ category: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories
                                            .filter((c) => c.type === "project") // Chỉ lấy category project
                                            .map((cat) => (
                                                <SelectItem
                                                    key={cat._id}
                                                    value={cat._id}
                                                >
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-2">
                                <Label>Tech Stack</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {form.techStack.map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {t}{" "}
                                            <X
                                                size={10}
                                                className="cursor-pointer"
                                                onClick={() => removeTech(t)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    placeholder="React, Next.js..."
                                    value={techInput}
                                    onChange={(e) =>
                                        setTechInput(e.target.value)
                                    }
                                    onKeyDown={handleTechKeyDown}
                                />
                            </div>

                            {/* Client & Links */}
                            <div className="space-y-3 pt-2 border-t">
                                <div>
                                    <Label className="text-xs">
                                        Khách hàng / Client
                                    </Label>
                                    <Input
                                        value={form.client}
                                        onChange={(e) =>
                                            setForm({ client: e.target.value })
                                        }
                                        placeholder="Tên khách hàng"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Demo URL</Label>
                                    <Input
                                        value={form.demoUrl}
                                        onChange={(e) =>
                                            setForm({ demoUrl: e.target.value })
                                        }
                                        placeholder="https://..."
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">
                                        Repository URL
                                    </Label>
                                    <Input
                                        value={form.repoUrl}
                                        onChange={(e) =>
                                            setForm({ repoUrl: e.target.value })
                                        }
                                        placeholder="https://github.com/..."
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div className="pt-2 border-t">
                                <Label>Ảnh đại diện (Thumbnail)</Label>
                                <div
                                    className="mt-2 aspect-video border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 relative"
                                    onClick={() =>
                                        thumbnailInputRef.current?.click()
                                    }
                                >
                                    {form.thumbnailUrl ? (
                                        <Image
                                            src={form.thumbnailUrl}
                                            alt="Thumb"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-muted-foreground">
                                            <UploadCloud className="mx-auto mb-1" />
                                            <span className="text-xs">
                                                Chọn ảnh
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={thumbnailInputRef}
                                    onChange={handleThumbnailChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
