import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/nodemailer";
import { getEmailTemplate } from "@/libs/emailTemplate";
import connectDB from "@/libs/db";
import Contact from "@/models/Contact";

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Vui lòng điền đầy đủ thông tin." },
                { status: 400 }
            );
        }

        try {
            await connectDB();
            await Contact.create({
                name,
                email,
                message,
            });
        } catch (dbError) {
            console.error("Lỗi khi lưu vào DB:", dbError);
        }

        const { text, html } = getEmailTemplate({ name, email, message });

        await sendEmail({
            to: process.env.USER_MAIL!,
            subject: `Tin nhắn liên hệ mới từ ${name}`,
            text,
            html,
        });

        return NextResponse.json(
            { message: "Đã gửi tin nhắn và lưu thành công!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json(
            { error: "Gửi tin nhắn thất bại." },
            { status: 500 }
        );
    }
}
