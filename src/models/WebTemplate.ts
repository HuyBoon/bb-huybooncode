import mongoose, { Schema, model, Document } from "mongoose";
import { ImageSchema, IImage } from "./Shared";

export interface IWebTemplate extends Document {
    name: string;
    slug: string;
    description: string;
    thumbnail: IImage;
    screenshots: IImage[];

    category: mongoose.Types.ObjectId;

    features: string[];

    previewUrl: string;
    price?: number;
    isFree: boolean;
    technologies: string[];
    status: "available" | "coming-soon";
    createdAt: Date;
    updatedAt: Date;
}

const WebTemplateSchema = new Schema<IWebTemplate>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        thumbnail: { type: ImageSchema, required: true },
        screenshots: [ImageSchema],
        category: { type: Schema.Types.ObjectId, ref: "Category" },
        features: [String],
        previewUrl: { type: String, required: true },
        price: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
        technologies: [String],
        status: {
            type: String,
            enum: ["available", "coming-soon"],
            default: "available",
        },
    },
    { timestamps: true }
);

const WebTemplate =
    mongoose.models.WebTemplate ||
    model<IWebTemplate>("WebTemplate", WebTemplateSchema);
export default WebTemplate;
