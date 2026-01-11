"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Rocket, Hammer, Timer } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
    title?: string;
    description?: string;
    icon?: "rocket" | "construction" | "timer"; // Chọn icon phù hợp ngữ cảnh
    backLink?: string; // Link quay về (mặc định là dashboard)
}

export function ComingSoon({
    title = "Tính năng đang phát triển",
    description = "Chúng tôi đang làm việc chăm chỉ để mang đến tính năng này sớm nhất có thể. Hãy quay lại sau nhé!",
    icon = "rocket",
    backLink = "/dashboard",
}: ComingSoonProps) {
    // Map icon string sang Component
    const IconComponent = {
        rocket: Rocket,
        construction: Hammer,
        timer: Timer,
    }[icon];

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md border-dashed border-2 shadow-none bg-transparent">
                <CardContent className="flex flex-col items-center text-center p-8 sm:p-12 space-y-6">
                    {/* Icon Animation */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <div className="relative p-6 bg-primary/10 rounded-full text-primary ring-1 ring-primary/20">
                                <IconComponent size={48} strokeWidth={1.5} />
                            </div>

                            {/* Hiệu ứng bay bổng nếu là rocket */}
                            {icon === "rocket" && (
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute -top-2 -right-2 text-yellow-500"
                                >
                                    ✨
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            {description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-4">
                        <Button variant="outline" asChild>
                            <Link href={backLink} className="gap-2">
                                <ArrowLeft size={16} />
                                Quay về Dashboard
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
