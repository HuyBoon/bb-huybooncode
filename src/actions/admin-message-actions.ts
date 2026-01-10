"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import Contact from "@/models/Contact";
import { auth } from "@/auth";

// Lấy danh sách tin nhắn
export async function getMessages() {
    try {
        await connectDB();
        const session = await auth();
        if (
            session?.user?.role !== "admin" &&
            session?.user?.role !== "superAdmin"
        ) {
            return { error: "Unauthorized" };
        }

        const messages = await Contact.find({})
            .sort({ createdAt: -1 }) // Tin mới nhất lên đầu
            .lean();

        // Serialize dữ liệu
        const serializedMessages = messages.map((msg: any) => ({
            ...msg,
            _id: msg._id.toString(),
            createdAt: msg.createdAt.toString(),
            updatedAt: msg.updatedAt.toString(),
        }));

        return { success: true, data: serializedMessages };
    } catch (error) {
        console.error("Get messages error:", error);
        return { error: "Lỗi khi tải tin nhắn." };
    }
}

// Xóa tin nhắn
export async function deleteMessage(id: string) {
    try {
        await connectDB();
        await Contact.findByIdAndDelete(id);
        revalidatePath("/admin/messages");
        return { success: true, message: "Đã xóa tin nhắn." };
    } catch (error) {
        return { error: "Lỗi khi xóa tin nhắn." };
    }
}

// Đánh dấu đã đọc/chưa đọc
export async function toggleMessageReadStatus(
    id: string,
    currentStatus: boolean
) {
    try {
        await connectDB();
        await Contact.findByIdAndUpdate(id, { isRead: !currentStatus });
        revalidatePath("/admin/messages");
        return { success: true };
    } catch (error) {
        return { error: "Lỗi cập nhật trạng thái." };
    }
}
