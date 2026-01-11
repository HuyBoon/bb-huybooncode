import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
    file: File,
    folder: string = "huyboontech/post"
) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ imgUrl: string; public_id: string }>(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { folder: folder, resource_type: "auto" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        if (result) {
                            resolve({
                                imgUrl: result.secure_url,
                                public_id: result.public_id,
                            });
                        }
                    }
                )
                .end(buffer);
        }
    );
}

export async function deleteFromCloudinary(public_id: string) {
    try {
        if (public_id) {
            await cloudinary.uploader.destroy(public_id);
        }
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
    }
}
