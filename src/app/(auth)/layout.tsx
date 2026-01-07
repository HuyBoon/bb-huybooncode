import "@/app/globals.css";
import { inter, jetbrainsMono } from "@/libs/fonts";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <main className="flex min-h-screen items-center justify-center bg-muted/40">
                        {children}
                    </main>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
