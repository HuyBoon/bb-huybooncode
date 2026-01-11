"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImageToCloudinary(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { error: "Không tìm thấy file" };

        // Chuyển File sang Buffer để upload qua SDK
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload stream
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "huybooncode-blog",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Lỗi upload ảnh lên Cloudinary" };
    }
}

export async function deleteImageFromCloudinary(public_id: string) {
    try {
        if (!public_id) return { error: "Thiếu public_id" };

        await cloudinary.uploader.destroy(public_id);

        return { success: true, message: "Đã xóa ảnh trên Cloud" };
    } catch (error) {
        console.error("Delete image error:", error);
        return { error: "Lỗi xóa ảnh" };
    }
}
