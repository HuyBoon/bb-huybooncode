import mongoose, { Schema, model, models } from "mongoose";

const SiteSettingsSchema = new Schema(
    {
        siteName: { type: String, default: "HuyBoonTech" },
        siteDescription: {
            type: String,
            default: "Frontend Developer Portfolio",
        },
        contactEmail: { type: String },
        maintenanceMode: { type: Boolean, default: false },
        socials: {
            github: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            facebook: { type: String, default: "" },
        },
        cvFile: { type: String, default: "" },
        cvFileName: { type: String, default: "HuyBoon_CV.pdf" },
    },
    { timestamps: true }
);

const SiteSettings =
    models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
