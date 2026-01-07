// src/app/admin/layout.tsx
import "@/app/globals.css";
import { inter, jetbrainsMono } from "@/libs/fonts"; // Tái sử dụng font
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata = {
    title: "Admin Dashboard - HuyBoonCode",
    robots: "noindex, nofollow", // Quan trọng: Không cho Google index trang Admin
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Hardcode lang="vi" vì Admin chỉ cần tiếng Việt
        <html lang="vi" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="flex h-screen w-full">
                        {/* Ví dụ: Sidebar Admin nằm ở đây */}
                        <aside className="w-64 bg-muted hidden md:block border-r">
                            {/* Admin Sidebar Component */}
                        </aside>

                        {/* Nội dung chính */}
                        <main className="flex-1 overflow-auto p-8">
                            {children}
                        </main>
                    </div>

                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
