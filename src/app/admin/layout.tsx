import "@/app/globals.css";
import { inter, jetbrainsMono } from "@/libs/fonts";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export const metadata = {
    title: "Admin Dashboard - HuyBoonCode",
    robots: "noindex, nofollow",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <div className="flex h-screen w-full">
                        <aside className="w-64 bg-muted hidden md:block border-r"></aside>

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
