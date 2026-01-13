"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Share2 } from "lucide-react";

interface SeoPreviewProps {
    title: string;
    description: string;
    slug: string;
    thumbnailUrl: string;
}

export function SeoPreview({
    title,
    description,
    slug,
    thumbnailUrl,
}: SeoPreviewProps) {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://huyboon.tech";
    const fullUrl = `${siteUrl}/blog/${slug}`;

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Globe size={18} /> Xem trước hiển thị SEO
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="google">
                    <TabsList className="w-full">
                        <TabsTrigger value="google" className="flex-1">
                            Google Search
                        </TabsTrigger>
                        <TabsTrigger value="social" className="flex-1">
                            Facebook / Social
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="google"
                        className="mt-4 p-4 border rounded-md bg-white dark:bg-black overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 max-w-150 font-sans">
                            <div className="flex items-center gap-2 text-sm text-[#202124] dark:text-[#dadce0]">
                                <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] overflow-hidden">
                                    {/* Logo giả lập */}
                                    HB
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="font-normal">
                                        HuyBoon Code
                                    </span>
                                    <span className="text-xs text-[#5f6368] dark:text-[#bdc1c6] truncate">
                                        {fullUrl}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer truncate font-normal">
                                {title || "Tiêu đề bài viết chưa có"}
                            </h3>
                            <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                                {description ||
                                    "Mô tả bài viết sẽ hiển thị ở đây. Hãy viết mô tả hấp dẫn để tăng tỉ lệ click..."}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="social"
                        className="mt-4 border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-900 max-w-125 mx-auto"
                    >
                        <div className="aspect-[1.91/1] relative bg-gray-300 w-full">
                            {thumbnailUrl ? (
                                <Image
                                    src={thumbnailUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Chưa có ảnh bìa
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-[#f0f2f5] dark:bg-[#242526] border-t border-gray-300 dark:border-gray-700">
                            <p className="text-xs text-gray-500 uppercase font-medium truncate">
                                HUYBOON.TECH
                            </p>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-1 line-clamp-2 leading-tight">
                                {title || "Tiêu đề bài viết"}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                {description || "Mô tả ngắn của bài viết..."}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
