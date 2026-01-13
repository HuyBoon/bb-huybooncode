"use client";

import { useState, useRef, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import slugify from "slugify";
import { Loader2, Save, ArrowLeft, UploadCloud, X } from "lucide-react";

import { createPost, updatePost } from "@/actions/post-actions";
import { uploadImageToCloudinary } from "@/actions/image-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { IPlainCategory, IPlainPost } from "@/types/backend";

const CKEditorPro = dynamic(
    () => import("@/components/admin/editor/CKEditorPro"),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 w-full bg-muted/20 animate-pulse rounded-md" />
        ),
    }
);

interface PostFormProps {
    categories: IPlainCategory[];
    initialData?: IPlainPost;
}

export function PostForm({ categories, initialData }: PostFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultCategoryId = initialData?.category?._id || "";

    const [tagInput, setTagInput] = useState("");

    const [form, setFormState] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        category: defaultCategoryId,

        tags: initialData?.tags || [],

        lessonId: initialData?.lessonId || undefined,
        descriptions: initialData?.metaDescription || "",
        content: initialData?.content || "",
        status: initialData?.status || "draft",

        thumbnailUrl: initialData?.thumbnail?.imgUrl || "",
        thumbnailPublicId: initialData?.thumbnail?.public_id || "",
        thumbnailPreview: initialData?.thumbnail?.imgUrl || "",
    });

    const setForm = (newData: Partial<typeof form>) => {
        setFormState((prev) => ({ ...prev, ...newData }));
    };

    const generateSlug = (value: string) => {
        return slugify(value, { lower: true, strict: true, locale: "vi" });
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newTag = tagInput.trim();

            if (newTag && !form.tags.includes(newTag)) {
                setForm({ tags: [...form.tags, newTag] });
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setForm({ tags: form.tags.filter((t) => t !== tagToRemove) });
    };

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading("Đang tải ảnh...");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await uploadImageToCloudinary(formData);
            if (res.success && res.url) {
                setForm({
                    thumbnailUrl: res.url,
                    thumbnailPublicId: res.public_id,
                    thumbnailPreview: res.url,
                });
                toast.success("Đã tải ảnh xong!", { id: toastId });
            } else {
                toast.error(res.error, { id: toastId });
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Lỗi upload ảnh");
        }
    };

    const handleEditorImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadImageToCloudinary(formData);
        if (res.success && res.url) return res.url;
        throw new Error("Upload failed");
    };

    const handleSubmit = () => {
        if (!form.title || !form.category || !form.thumbnailUrl) {
            toast.error("Vui lòng điền: Tiêu đề, Danh mục và Ảnh bìa");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("slug", form.slug || generateSlug(form.title));
        formData.append("descriptions", form.descriptions);
        formData.append("category", form.category);
        formData.append("status", form.status);

        formData.append("tags", form.tags.join(","));

        if (form.lessonId)
            formData.append("lessionId", form.lessonId.toString());
        if (initialData) formData.append("id", initialData._id);

        startTransition(async () => {
            const thumbnailData = {
                url: form.thumbnailUrl,
                public_id: form.thumbnailPublicId,
            };

            let result;
            if (initialData) {
                result = await updatePost(
                    formData,
                    form.content,
                    thumbnailData
                );
            } else {
                result = await createPost(
                    formData,
                    form.content,
                    thumbnailData
                );
            }

            if (result.success) {
                toast.success(result.message);
                router.push("/admin/posts");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-4 border-b -mx-6 -mt-6 mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">
                            {initialData ? "Sửa bài viết" : "Viết bài mới"}
                        </h1>
                    </div>
                </div>
                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Save className="mr-2" />
                    )}
                    {initialData ? "Cập nhật" : "Xuất bản"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI - CHIẾM 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tiêu đề */}
                    <div>
                        <Label>Tiêu đề</Label>
                        <Input
                            placeholder="Tiêu đề bài viết..."
                            className="text-3xl font-extrabold h-14 mt-2"
                            value={form.title}
                            onChange={(e) => {
                                setForm({ title: e.target.value });
                                if (!initialData)
                                    setForm({
                                        slug: generateSlug(e.target.value),
                                    });
                            }}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <Label>Slug (URL)</Label>
                        <Input
                            value={form.slug}
                            onChange={(e) =>
                                setForm({ slug: generateSlug(e.target.value) })
                            }
                            placeholder="tieu-de-bai-viet"
                            className="font-mono text-sm mt-2"
                            spellCheck={false}
                        />
                    </div>

                    <div>
                        <Label>Mô tả ngắn (SEO)</Label>
                        <Textarea
                            value={form.descriptions}
                            rows={4}
                            onChange={(e) =>
                                setForm({ descriptions: e.target.value })
                            }
                            placeholder="Tóm tắt nội dung để hiển thị ở danh sách..."
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label className="mb-2 block">Nội dung bài viết</Label>
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                            <CKEditorPro
                                content={form.content}
                                onChange={(html) => setForm({ content: html })}
                                onUploadImage={handleEditorImageUpload}
                                placeholder="Bắt đầu viết nội dung tại đây..."
                            />
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI - SETTINGS */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            {/* Danh mục */}
                            <div>
                                <Label>Danh mục</Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(v) =>
                                        setForm({ category: v })
                                    }
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80">
                                        {categories?.map((cat) => (
                                            <SelectItem
                                                key={cat._id}
                                                value={cat._id}
                                            >
                                                <span className="flex items-center">
                                                    <span className="text-muted-foreground/40 mr-1">
                                                        {"└─ ".repeat(
                                                            cat.depth || 0
                                                        )}
                                                    </span>
                                                    {cat.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* --- PHẦN TAGS MỚI BỔ SUNG --- */}
                            <div>
                                <Label>Thẻ (Tags)</Label>
                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                    {form.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            {tag}
                                            <X
                                                size={12}
                                                className="cursor-pointer hover:text-destructive"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    placeholder="Nhập thẻ rồi nhấn Enter..."
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={handleTagKeyDown}
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    Dùng dấu phẩy hoặc Enter để thêm thẻ.
                                </p>
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <Label>Trạng thái</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(v) =>
                                        setForm({ status: v as any })
                                    }
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Bản nháp
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Đã xuất bản
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* STT bài học */}
                            <div>
                                <Label>STT bài học (Tùy chọn)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    className="mt-2"
                                    placeholder="VD: 1, 2..."
                                    value={form.lessonId ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setForm({
                                            lessonId: val
                                                ? Number(val)
                                                : undefined,
                                        });
                                    }}
                                />
                            </div>

                            {/* Ảnh bìa */}
                            <div>
                                <Label>Ảnh bìa</Label>
                                {form.thumbnailPreview ? (
                                    <div className="relative mt-3 group">
                                        <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm">
                                            <Image
                                                src={form.thumbnailPreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            Thay đổi
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        className="border-2 border-dashed border-border rounded-xl aspect-video flex flex-col items-center justify-center bg-muted/30 mt-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-muted-foreground text-sm">
                                            Chưa chọn ảnh bìa
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleImage}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
