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

        const rawData = {
            siteName: formData.get("siteName"),
            siteDescription: formData.get("siteDescription"),
            contactEmail: formData.get("contactEmail"),
            // Checkbox trong form html trả về "on" nếu checked, null nếu không
            maintenanceMode: formData.get("maintenanceMode") === "on",
            socials: {
                github: formData.get("github"),
                linkedin: formData.get("linkedin"),
                facebook: formData.get("facebook"),
            },
        };

        // Update bản ghi đầu tiên tìm thấy, hoặc tạo mới nếu chưa có
        await SiteSettings.findOneAndUpdate({}, rawData, {
            upsert: true,
            new: true,
        });

        revalidatePath("/"); // Revalidate toàn bộ site vì setting ảnh hưởng header/footer
        return { success: true, message: "Cập nhật cấu hình thành công!" };
    } catch (error) {
        console.error("Update settings error:", error);
        return { error: "Lỗi hệ thống khi lưu cấu hình." };
    }
}
