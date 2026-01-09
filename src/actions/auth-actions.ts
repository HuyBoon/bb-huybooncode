"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import connectDB from "@/libs/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

// ... imports

export async function authenticate(
    prevState: any, // Đổi type thành any hoặc định nghĩa interface State
    formData: FormData
) {
    // 1. Lấy email ra trước để trả về nếu lỗi
    const email = formData.get("email") as string;

    try {
        await signIn("credentials", {
            email: email,
            password: formData.get("password"),
            redirectTo: "/admin",
            redirect: true,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        message: "Email hoặc mật khẩu không chính xác.",
                        inputs: { email }, // Trả lại email
                    };

                case "CallbackRouteError":
                    const errMessage = error.cause?.err?.message;
                    if (errMessage === "ACCOUNT_LOCKED") {
                        return {
                            message:
                                "Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt.",
                            inputs: { email },
                        };
                    }
                    return {
                        message: "Đã có lỗi xảy ra khi xác thực.",
                        inputs: { email },
                    };

                default:
                    return {
                        message: "Đã có lỗi hệ thống xảy ra.",
                        inputs: { email },
                    };
            }
        }
        throw error;
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: "/login" });
}

// --- REGISTER ---
const RegisterSchema = z
    .object({
        name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu nhập lại không khớp",
        path: ["confirmPassword"],
    });

export async function register(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    // 1. Validate
    const validatedFields = RegisterSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Dữ liệu nhập vào không hợp lệ.",
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { message: "Email này đã được sử dụng." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            provider: "credentials",
            isActive: true,
            image: "",
        });

        return {
            success: true,
            message: "Đăng ký thành công! Vui lòng đăng nhập.",
        };
    } catch (error) {
        console.error("Register Error:", error);
        return {
            message: "Lỗi hệ thống, vui lòng thử lại sau.",

            inputs: {
                name: name,
                email: email,
            },
        };
    }
}
