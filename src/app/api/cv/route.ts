import { NextResponse } from "next/server";
import connectDB from "@/libs/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
    try {
        await connectDB();
        const settings = await SiteSettings.findOne().select(
            "cvFile cvFileName"
        );

        if (!settings || !settings.cvFile) {
            return new NextResponse("CV not found", { status: 404 });
        }

        const base64Data = settings.cvFile.split(";base64,").pop();
        const buffer = Buffer.from(base64Data, "base64");

        const headers = new Headers();
        headers.append("Content-Type", "application/pdf");

        // 👇 SỬA DÒNG NÀY: Đổi 'attachment' thành 'inline'
        headers.append(
            "Content-Disposition",
            `inline; filename="${settings.cvFileName || "HuyBoon_CV.pdf"}"`
        );

        return new NextResponse(buffer, { headers });
    } catch (error) {
        console.error("Download CV error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
