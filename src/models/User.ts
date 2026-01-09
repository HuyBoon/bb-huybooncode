import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    role: "superAdmin" | "admin" | "user";
    image?: string;
    provider: "credentials" | "google" | "github";
    isActive: boolean;
    emailVerified?: Date;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên hiển thị"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false,
        },
        role: {
            type: String,
            enum: ["superAdmin", "admin", "user"],
            default: "user",
        },
        image: {
            type: String,
            default: "",
        },
        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        emailVerified: {
            type: Date,
            default: null,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) {
                delete (ret as any).password;
                ret.id = ret._id;
                delete (ret as any)._id;
            },
        },
    }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
