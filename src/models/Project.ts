import mongoose, { Schema, model, Document } from "mongoose";
import { ImageSchema, IImage } from "./Shared";

export interface IProject extends Document {
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnail: IImage;
    gallery: IImage[];
    category: mongoose.Types.ObjectId;
    techStack: string[];
    client?: string;
    demoUrl?: string;
    repoUrl?: string;

    isFeatured: boolean;
    status: "completed" | "in-progress";
    completionDate?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        shortDescription: { type: String },

        thumbnail: { type: ImageSchema, required: true },
        gallery: [ImageSchema], // Mảng ảnh

        category: { type: Schema.Types.ObjectId, ref: "Category" },

        techStack: { type: [String], default: [] },

        client: String,
        demoUrl: String,
        repoUrl: String,

        isFeatured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["completed", "in-progress"],
            default: "completed",
        },
        completionDate: Date,
    },
    { timestamps: true }
);

ProjectSchema.index({ title: "text" });

const Project =
    mongoose.models.Project || model<IProject>("Project", ProjectSchema);
export default Project;
