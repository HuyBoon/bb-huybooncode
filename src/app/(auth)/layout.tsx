import "@/app/globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ThemeProvider } from "next-themes";
import { ThemeButtons } from "@/components/ui/ThemeButtons"; // Component đổi theme (nếu chưa có mình sẽ cung cấp bên dưới)
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "Authentication - HuyBoonTech",
    description: "Secure login and registration for HuyBoonTech ecosystem.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="relative flex min-h-screen flex-col">
                        {/* --- HEADER (Floating) --- */}
                        <header className="absolute top-0 left-0 w-full z-50 p-4 md:p-6 flex items-center justify-between">
                            {/* Nút quay về trang chủ */}
                            <Button
                                variant="ghost"
                                asChild
                                className="-ml-2 text-muted-foreground hover:text-foreground"
                            >
                                <Link
                                    href="/"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft size={18} />
                                    <span className="hidden sm:inline font-medium">
                                        Back to Home
                                    </span>
                                </Link>
                            </Button>

                            {/* Logo ở giữa (Chỉ hiện trên mobile để thay thế cho logo trong form) */}
                            {/* <div className="md:hidden font-bold text-lg flex items-center gap-1">
                                <span className="text-primary">&lt;</span>
                                HB
                                <span className="text-primary">/&gt;</span>
                            </div> */}

                            {/* Nút đổi Theme */}
                            <div className="flex items-center gap-2">
                                <ThemeButtons />
                            </div>
                        </header>

                        {/* --- MAIN CONTENT --- */}
                        <main className="flex-1">{children}</main>

                        {/* --- FOOTER (Floating) --- */}
                        <footer className="absolute bottom-0 w-full z-50 py-4 text-center">
                            <p className="text-xs text-muted-foreground/60">
                                © {new Date().getFullYear()} HuyBoonTech. All
                                rights reserved.
                            </p>
                            <div className="flex justify-center gap-4 mt-1 text-[10px] text-muted-foreground/40">
                                <Link
                                    href="/terms"
                                    className="hover:text-foreground hover:underline"
                                >
                                    Terms of Service
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="hover:text-foreground hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                            </div>
                        </footer>
                    </div>

                    <Toaster richColors position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}
