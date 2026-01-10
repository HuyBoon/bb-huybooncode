"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/libs/db";
import User from "@/models/User";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
        newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export async function removeFavorite(postId: string) {
    try {
        const session = await auth();
        if (!session) return { error: "Unauthorized" };

        await connectDB();

        // Giả sử trong User Model có field 'savedPosts' là mảng ObjectId
        await User.findByIdAndUpdate(session.user.id, {
            $pull: { savedPosts: postId },
        });

        // Refresh lại trang để cập nhật UI
        revalidatePath("/favorites");
        return {
            success: true,
            message: "Đã xóa bài viết khỏi danh sách lưu.",
        };
    } catch (error) {
        console.error("Remove favorite error:", error);
        return { error: "Có lỗi xảy ra." };
    }
}

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session) return { error: "Bạn chưa đăng nhập." };

    const name = formData.get("name") as string;

    if (!name || name.length < 2) {
        return { error: "Tên phải có ít nhất 2 ký tự." };
    }

    try {
        await connectDB();

        await User.findByIdAndUpdate(session.user.id, { name });

        revalidatePath("/profile");

        return { success: true, message: "Cập nhật hồ sơ thành công!" };
    } catch (error) {
        console.error("Update profile error:", error);
        return { error: "Lỗi hệ thống, vui lòng thử lại." };
    }
}
export async function deleteAccount() {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    try {
        await connectDB();

        await User.findByIdAndDelete(session.user.id);

        return { success: true };
    } catch (error) {
        console.error("Delete account error:", error);
        return { error: "Lỗi hệ thống, không thể xóa tài khoản." };
    }
}

export async function changePassword(formData: FormData) {
    const session = await auth();
    if (!session) return { error: "Bạn chưa đăng nhập." };

    const rawData = Object.fromEntries(formData.entries());

    const validated = ChangePasswordSchema.safeParse(rawData);
    if (!validated.success) {
        const firstError = validated.error.errors[0].message;
        return { error: firstError };
    }

    const { currentPassword, newPassword } = validated.data;

    try {
        await connectDB();

        const user = await User.findById(session.user.id).select("+password");

        if (!user || !user.password) {
            return {
                error: "Tài khoản này đăng nhập bằng Google/Github nên không có mật khẩu.",
            };
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return { error: "Mật khẩu hiện tại không chính xác." };
        }

        if (currentPassword === newPassword) {
            return { error: "Mật khẩu mới không được trùng với mật khẩu cũ." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(session.user.id, {
            password: hashedPassword,
        });

        revalidatePath("/profile");
        return { success: true, message: "Đổi mật khẩu thành công!" };
    } catch (error) {
        console.error("Change password error:", error);
        return { error: "Lỗi hệ thống, vui lòng thử lại." };
    }
}
