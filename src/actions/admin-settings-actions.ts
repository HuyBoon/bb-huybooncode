"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import SiteSettings from "@/models/SiteSettings";
import { auth } from "@/auth";

export async function getSiteSettings() {
    try {
        await connectDB();

        let settings: any = await SiteSettings.findOne().lean();

        if (!settings) {
            const newSettings = await SiteSettings.create({});

            settings = newSettings.toObject();
        }

        return {
            ...settings,
            _id: settings._id.toString(),
            createdAt: settings.createdAt?.toString(),
            updatedAt: settings.updatedAt?.toString(),
        };
    } catch (error) {
        console.error("Get settings error:", error);
        return null;
    }
}

export async function updateSiteSettings(formData: FormData) {
    try {
        const session = await auth();
        if (
            session?.user?.role !== "admin" &&
            session?.user?.role !== "superAdmin"
        ) {
            return { error: "Unauthorized" };
        }

        await connectDB();

        // 👇 SỬA TẠI ĐÂY: Thêm ": any" vào sau rawData
        const rawData: any = {
            siteName: formData.get("siteName"),
            siteDescription: formData.get("siteDescription"),
            contactEmail: formData.get("contactEmail"),
            maintenanceMode: formData.get("maintenanceMode") === "on",
            socials: {
                github: formData.get("github"),
                linkedin: formData.get("linkedin"),
                facebook: formData.get("facebook"),
            },
        };

        // --- XỬ LÝ CV ---
        const cvFile = formData.get("cvFile") as string;

        // Bây giờ bạn có thể gán thoải mái mà không bị lỗi đỏ
        if (cvFile && cvFile.startsWith("data:application/pdf")) {
            rawData.cvFile = cvFile;
            rawData.cvFileName = "HuyBoon_CV.pdf";
        }
        // ----------------

        await SiteSettings.findOneAndUpdate({}, rawData, {
            upsert: true,
            new: true,
        });

        revalidatePath("/");
        return { success: true, message: "Cập nhật cấu hình thành công!" };
    } catch (error) {
        console.error("Update settings error:", error);
        return { error: "Lỗi hệ thống khi lưu cấu hình." };
    }
}
