"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import User from "@/models/User";
import { auth } from "@/auth";

export async function getAllUsers(query: string = "") {
    try {
        await connectDB();
        const session = await auth();
        if (
            session?.user?.role !== "admin" &&
            session?.user?.role !== "superAdmin"
        ) {
            return { error: "Unauthorized" };
        }

        const searchCondition = query
            ? {
                  $or: [
                      { name: { $regex: query, $options: "i" } },
                      { email: { $regex: query, $options: "i" } },
                  ],
              }
            : {};

        const users = await User.find(searchCondition)
            .sort({ createdAt: -1 })
            .select("-password")
            .lean();

        const serializedUsers = users.map((user: any) => ({
            ...user,
            _id: user._id.toString(),
            createdAt: user.createdAt?.toString(),
            updatedAt: user.updatedAt?.toString(),
        }));

        return { success: true, data: serializedUsers };
    } catch (error) {
        console.error("Get users error:", error);
        return { error: "Lỗi khi tải danh sách người dùng." };
    }
}

// Đổi quyền (Role)
export async function toggleUserRole(userId: string, currentRole: string) {
    try {
        const session = await auth();
        // Check quyền Admin chặn ở Server
        if (
            session?.user?.role !== "admin" &&
            session?.user?.role !== "superAdmin"
        ) {
            return { error: "Bạn không có quyền thực hiện hành động này." };
        }

        // Không cho phép tự đổi quyền của chính mình
        if (session?.user?.id === userId) {
            return { error: "Không thể tự thay đổi quyền của chính mình." };
        }

        await connectDB();
        const newRole = currentRole === "admin" ? "user" : "admin";

        await User.findByIdAndUpdate(userId, { role: newRole });
        revalidatePath("/admin/customers");

        return { success: true, message: `Đã chuyển quyền thành ${newRole}` };
    } catch (error) {
        return { error: "Lỗi hệ thống." };
    }
}

// Xóa User
export async function deleteUser(userId: string) {
    try {
        const session = await auth();
        if (
            session?.user?.role !== "admin" &&
            session?.user?.role !== "superAdmin"
        ) {
            return { error: "Unauthorized" };
        }

        if (session?.user?.id === userId) {
            return { error: "Không thể tự xóa tài khoản đang đăng nhập." };
        }

        await connectDB();
        await User.findByIdAndDelete(userId);

        revalidatePath("/admin/customers");
        return { success: true, message: "Đã xóa người dùng thành công." };
    } catch (error) {
        return { error: "Lỗi khi xóa người dùng." };
    }
}
