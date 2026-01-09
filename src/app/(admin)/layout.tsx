import "@/app/globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/admin/SidebarContext";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";
import { AdminHeader } from "@/components/admin/AdminHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata = {
    title: "Admin Dashboard - HuyBoonCode",
    robots: "noindex, nofollow",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log("session", session);
    if (!session?.user) {
        redirect("/admin/login");
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-muted/40`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider>
                        <AdminLayoutWrapper>
                            <AdminHeader user={session.user} />

                            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                                <div className="mx-auto max-w-7xl w-full">
                                    {children}
                                </div>
                            </main>
                        </AdminLayoutWrapper>
                    </SidebarProvider>

                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
