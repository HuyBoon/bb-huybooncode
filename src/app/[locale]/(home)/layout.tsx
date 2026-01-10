import { auth } from "@/auth";
import DefaultHeader from "@/components/layout/DefaultHeader";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default async function ServiceLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth();
    return (
        <>
            <DefaultHeader session={session} />
            <main className="min-h-screen py-24 dark:bg-gray-900 bg-gray-100">
                {children}
            </main>
            <Footer />
        </>
    );
}
