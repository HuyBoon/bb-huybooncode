import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    status: "active" | "inactive";
    parent?: string | null;
    ancestors?: string[];
    depth?: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        // Lưu mảng các ID cha để dễ truy vấn (Pattern: Materialized Path)
        ancestors: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        depth: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index để tìm kiếm nhanh
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parent: 1 });

const Category =
    models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
