"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import connectDB from "@/libs/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

export async function authenticate(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    let userRole = "user";

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        await connectDB();
        const user = await User.findOne({ email }).select("role");
        if (user) userRole = user.role;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        message: "Email hoặc mật khẩu không chính xác.",
                        inputs: { email },
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

    if (userRole === "admin" || userRole === "superAdmin") {
        redirect("/admin");
    } else {
        redirect("/dashboard");
    }
}

export async function handleSignOut() {
    await signOut({ redirectTo: "/login" });
}

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

    const validatedFields = RegisterSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Dữ liệu nhập vào không hợp lệ.",
            inputs: {
                name: rawData.name as string,
                email: rawData.email as string,
            },
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                message: "Email này đã được sử dụng.",
                inputs: { name, email },
            };
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
            inputs: { name, email },
        };
    }
}
