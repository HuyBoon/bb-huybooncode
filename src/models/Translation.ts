import mongoose, { Schema, model, Model, Document } from "mongoose";

export interface ITranslation extends Document {
    refId: mongoose.Types.ObjectId;
    refModel: string;
    field: string;
    language: string;
    value: string;
}

const TranslationSchema: Schema<ITranslation> = new Schema(
    {
        refId: {
            type: Schema.Types.ObjectId,
            required: [true, "Reference ID is required"],
            index: true,
        },
        refModel: {
            type: String,
            required: [true, "Reference model is required"],
        },
        field: {
            type: String,
            required: [true, "Field is required"],
        },
        language: {
            type: String,
            required: [true, "Language is required"],
            match: [
                /^[a-z]{2}$/,
                "Language must be a 2-letter code (e.g., 'en', 'vi')",
            ],
        },
        value: {
            type: String,
            required: [true, "Translation value is required"],
        },
    },
    { timestamps: true }
);

TranslationSchema.index(
    { refId: 1, refModel: 1, field: 1, language: 1 },
    { unique: true }
);

export const Translation: Model<ITranslation> =
    mongoose.models.Translation ||
    model<ITranslation>("Translation", TranslationSchema);
