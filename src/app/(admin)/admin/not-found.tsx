"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 border border-border shadow-sm">
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-2 max-w-md px-4"
            >
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    404 - Page Not Found
                </h2>
                <p className="text-muted-foreground">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển
                    trong hệ thống quản trị.
                </p>
                <p className="text-xs text-muted-foreground/60 font-mono pt-2">
                    Error Code: ADMIN_ROUTE_MISSING
                </p>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3"
            >
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="gap-2"
                >
                    <ArrowLeft size={16} />
                    Quay lại
                </Button>

                <Button asChild className="gap-2">
                    <Link href="/admin">
                        <LayoutDashboard size={16} />
                        Về Dashboard
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}
