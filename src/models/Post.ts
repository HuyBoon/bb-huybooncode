import mongoose, { Schema, model, Document } from "mongoose";
import { ImageSchema, IImage } from "./Shared"; // Import từ file Shared đã tạo trước đó

export interface IPost extends Document {
    category: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    metaDescription: string;
    content: string;
    thumbnail: IImage;
    tags: string[];
    author: string;
    lessonId?: number;
    publishedDate?: Date;
    timeRead: string;
    status: "draft" | "published";
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        metaDescription: {
            type: String,
            default: "",
            trim: true,
        },
        content: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: ImageSchema,
            required: [true, "Thumbnail is required"],
        },
        tags: {
            type: [String],
            default: [],
        },
        author: {
            type: String,
            default: "Admin",
        },
        lessonId: {
            type: Number,
            sparse: true,
        },
        publishedDate: {
            type: Date,
        },
        timeRead: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
    },
    { timestamps: true }
);

// Index tìm kiếm
PostSchema.index({ title: "text", slug: "text" });

const Post = mongoose.models.Post || model<IPost>("Post", PostSchema);

export default Post;
