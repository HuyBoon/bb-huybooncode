import { Schema } from "mongoose";

export interface IImage {
    imgUrl: string;
    public_id: string;
}

export const ImageSchema = new Schema<IImage>(
    {
        imgUrl: {
            type: String,
            required: [true, "Image URL is required"],
        },
        public_id: {
            type: String,
            required: [true, "Cloudinary public_id is required"],
        },
    },
    { _id: false }
);
