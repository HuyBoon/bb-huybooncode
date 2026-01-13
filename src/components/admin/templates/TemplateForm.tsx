"use client";

import { useState, useRef, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import slugify from "slugify";
import { Loader2, Save, ArrowLeft, UploadCloud, X, Plus } from "lucide-react";

import {
    createTemplate,
    updateTemplate,
    deleteTemplateScreenshot,
} from "@/actions/template-actions";
import { uploadImageToCloudinary } from "@/actions/image-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { IPlainCategory, IPlainWebTemplate } from "@/types/backend";

const CKEditorPro = dynamic(
    () => import("@/components/admin/editor/CKEditorPro"),
    {
        ssr: false,
        loading: () => (
            <div className="h-64 bg-muted/20 animate-pulse rounded-md" />
        ),
    }
);

interface TemplateFormProps {
    categories: IPlainCategory[];
    initialData?: IPlainWebTemplate;
}

export function TemplateForm({ categories, initialData }: TemplateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const thumbnailRef = useRef<HTMLInputElement>(null);
    const screenshotsRef = useRef<HTMLInputElement>(null);

    // Dynamic inputs
    const [techInput, setTechInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");

    const [form, setFormState] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        category: initialData?.category?._id || "",
        previewUrl: initialData?.previewUrl || "",
        price: initialData?.price || 0,
        isFree: initialData?.isFree || false,
        status: initialData?.status || "available",
        technologies: initialData?.technologies || [],
        features: initialData?.features || [],
        description: initialData?.description || "",

        thumbnailUrl: initialData?.thumbnail?.imgUrl || "",
        thumbnailPublicId: initialData?.thumbnail?.public_id || "",
        screenshots: initialData?.screenshots || [],
        newScreenshotFiles: [] as File[],
    });

    const setForm = (d: Partial<typeof form>) =>
        setFormState((prev) => ({ ...prev, ...d }));
    const generateSlug = (val: string) =>
        slugify(val, { lower: true, strict: true, locale: "vi" });

    // Logic xử lý mảng (Technologies & Features)
    const addArrayItem = (key: "technologies" | "features", val: string) => {
        if (val && !form[key].includes(val))
            setForm({ [key]: [...form[key], val] });
    };
    const removeArrayItem = (key: "technologies" | "features", val: string) => {
        setForm({ [key]: form[key].filter((i) => i !== val) });
    };

    // Upload Thumbnail
    const handleThumbChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const toastId = toast.loading("Uploading...");
        const fd = new FormData();
        fd.append("file", file);
        const res = await uploadImageToCloudinary(fd);
        if (res.success && res.url) {
            setForm({
                thumbnailUrl: res.url,
                thumbnailPublicId: res.public_id,
            });
            toast.success("Xong!", { id: toastId });
        } else toast.error("Lỗi", { id: toastId });
    };

    // Screenshots
    const handleScreenshotsSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files)
            setForm({
                newScreenshotFiles: [
                    ...form.newScreenshotFiles,
                    ...Array.from(e.target.files),
                ],
            });
    };
    const removeScreenshot = async (publicId: string) => {
        if (!initialData || !confirm("Xóa ảnh này?")) return;
        const res = await deleteTemplateScreenshot(initialData._id, publicId);
        if (res.success) {
            setForm({
                screenshots: form.screenshots.filter(
                    (s) => s.public_id !== publicId
                ),
            });
            toast.success("Đã xóa ảnh");
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.thumbnailUrl || !form.category) {
            toast.error("Điền đủ: Tên, Ảnh bìa, Danh mục");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("slug", form.slug || generateSlug(form.name));
        formData.append("category", form.category);
        formData.append("status", form.status);
        formData.append("previewUrl", form.previewUrl);
        formData.append("price", form.price.toString());
        formData.append("isFree", String(form.isFree));
        // Gửi mảng dạng chuỗi phân cách
        formData.append("technologies", form.technologies.join(","));
        formData.append("features", form.features.join("|")); // Dùng | cho feature vì nó có thể chứa dấu phẩy

        if (initialData) formData.append("id", initialData._id);

        startTransition(async () => {
            // Upload new screenshots
            const newScreenshotsData: { url: string; public_id: string }[] = [];
            if (form.newScreenshotFiles.length > 0) {
                const results = await Promise.all(
                    form.newScreenshotFiles.map((f) => {
                        const fd = new FormData();
                        fd.append("file", f);
                        return uploadImageToCloudinary(fd);
                    })
                );
                results.forEach((r) => {
                    if (r.success && r.url)
                        newScreenshotsData.push({
                            url: r.url,
                            public_id: r.public_id,
                        });
                });
            }

            const thumbnailData = {
                url: form.thumbnailUrl,
                public_id: form.thumbnailPublicId,
            };

            const result = initialData
                ? await updateTemplate(
                      formData,
                      form.description,
                      thumbnailData,
                      newScreenshotsData
                  )
                : await createTemplate(
                      formData,
                      form.description,
                      thumbnailData,
                      newScreenshotsData
                  );

            if (result.success) {
                toast.success(result.message);
                router.push("/admin/templates");
            } else toast.error(result.error);
        });
    };

    return (
        <div className="space-y-10 pb-20">
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
                        {initialData ? "Sửa Template" : "Thêm Template mới"}
                    </h1>
                </div>
                <Button onClick={handleSubmit} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="animate-spin mr-2" />
                    ) : (
                        <Save className="mr-2" />
                    )}{" "}
                    Lưu
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin chính</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Tên Template</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm({ name: e.target.value });
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
                                <Label className="mb-2 block">
                                    Mô tả chi tiết
                                </Label>
                                <div className="border rounded-md">
                                    <CKEditorPro
                                        content={form.description}
                                        onChange={(h) =>
                                            setForm({ description: h })
                                        }
                                        onUploadImage={async (f) => {
                                            const fd = new FormData();
                                            fd.append("file", f);
                                            const res =
                                                await uploadImageToCloudinary(
                                                    fd
                                                );
                                            return res.url || "";
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features & Tech */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Đặc điểm & Công nghệ</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Features */}
                            <div>
                                <Label>Tính năng nổi bật</Label>
                                <div className="space-y-2 mt-2">
                                    {form.features.map((f, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm"
                                        >
                                            <span>• {f}</span>
                                            <X
                                                size={14}
                                                className="cursor-pointer text-muted-foreground hover:text-red-500"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "features",
                                                        f
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="VD: Chuẩn SEO, Dark Mode..."
                                            value={featureInput}
                                            onChange={(e) =>
                                                setFeatureInput(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addArrayItem(
                                                        "features",
                                                        featureInput
                                                    );
                                                    setFeatureInput("");
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            size="icon"
                                            onClick={() => {
                                                addArrayItem(
                                                    "features",
                                                    featureInput
                                                );
                                                setFeatureInput("");
                                            }}
                                        >
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {/* Tech Stack */}
                            <div>
                                <Label>Công nghệ sử dụng</Label>
                                <div className="flex flex-wrap gap-2 mb-2 mt-2">
                                    {form.technologies.map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            {t}{" "}
                                            <X
                                                size={10}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "technologies",
                                                        t
                                                    )
                                                }
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
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === ","
                                        ) {
                                            e.preventDefault();
                                            addArrayItem(
                                                "technologies",
                                                techInput
                                            );
                                            setTechInput("");
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Screenshots */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Screenshots (Ảnh chụp màn hình)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                {form.screenshots.map((img, i) => (
                                    <div
                                        key={i}
                                        className="relative aspect-video rounded-md overflow-hidden border group"
                                    >
                                        <Image
                                            src={img.imgUrl}
                                            alt="Scr"
                                            fill
                                            className="object-cover"
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() =>
                                                removeScreenshot(img.public_id)
                                            }
                                        >
                                            <X size={12} />
                                        </Button>
                                    </div>
                                ))}
                                {form.newScreenshotFiles.map((f, i) => (
                                    <div
                                        key={`new-${i}`}
                                        className="relative aspect-video rounded-md overflow-hidden border"
                                    >
                                        <Image
                                            src={URL.createObjectURL(f)}
                                            alt="New"
                                            fill
                                            className="object-cover opacity-80"
                                        />
                                        <Badge className="absolute top-1 left-1 text-[10px]">
                                            New
                                        </Badge>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-6 w-6"
                                            onClick={() =>
                                                setForm({
                                                    newScreenshotFiles:
                                                        form.newScreenshotFiles.filter(
                                                            (_, idx) =>
                                                                idx !== i
                                                        ),
                                                })
                                            }
                                        >
                                            <X size={12} />
                                        </Button>
                                    </div>
                                ))}
                                <div
                                    className="aspect-video border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                                    onClick={() =>
                                        screenshotsRef.current?.click()
                                    }
                                >
                                    <UploadCloud className="mb-1" />{" "}
                                    <span className="text-xs">Thêm ảnh</span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    hidden
                                    ref={screenshotsRef}
                                    onChange={handleScreenshotsSelect}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- Right Column --- */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cấu hình</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                        <SelectItem value="available">
                                            Sẵn sàng
                                        </SelectItem>
                                        <SelectItem value="coming-soon">
                                            Sắp ra mắt
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                                            .filter(
                                                (c) => c.type === "template"
                                            )
                                            .map((c) => (
                                                <SelectItem
                                                    key={c._id}
                                                    value={c._id}
                                                >
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between border p-3 rounded-md">
                                <Label>Miễn phí?</Label>
                                <Switch
                                    checked={form.isFree}
                                    onCheckedChange={(c) =>
                                        setForm({
                                            isFree: c,
                                            price: c ? 0 : form.price,
                                        })
                                    }
                                />
                            </div>
                            {!form.isFree && (
                                <div>
                                    <Label>Giá bán (VNĐ)</Label>
                                    <Input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({
                                                price: Number(e.target.value),
                                            })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            )}
                            <div>
                                <Label>Link Demo (Preview)</Label>
                                <Input
                                    value={form.previewUrl}
                                    onChange={(e) =>
                                        setForm({ previewUrl: e.target.value })
                                    }
                                    placeholder="https://..."
                                    className="mt-1"
                                />
                            </div>
                            <div className="pt-4 border-t">
                                <Label>Ảnh đại diện (Thumbnail)</Label>
                                <div
                                    className="mt-2 aspect-video border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/50 relative"
                                    onClick={() =>
                                        thumbnailRef.current?.click()
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
                                    ref={thumbnailRef}
                                    onChange={handleThumbChange}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
