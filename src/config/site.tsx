import React from "react";
import {
    FaReact,
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaLanguage,
    FaUserShield,
    FaDocker,
} from "react-icons/fa";
import {
    SiCloudinary,
    SiFirebase,
    SiMongodb,
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";

const ICONS = {
    React: { icon: FaReact, color: "text-[#61DAFB]" },
    "Next.js": { icon: SiNextdotjs, color: "text-black dark:text-white" },
    Tailwind: { icon: SiTailwindcss, color: "text-[#06B6D4]" },
    TypeScript: { icon: SiTypescript, color: "text-[#3178C6]" },
    Firebase: { icon: SiFirebase, color: "text-[#FFCA28]" },
    "Node.js": { icon: FaNodeJs, color: "text-[#339933]" },
    HTML: { icon: FaHtml5, color: "text-[#e34c26]" },
    CSS: { icon: FaCss3Alt, color: "text-[#264de4]" },
    MongoDB: { icon: SiMongodb, color: "text-[#47A248]" },
    Cloudinary: { icon: SiCloudinary, color: "text-[#3448C5]" },
    "next-intl": { icon: FaLanguage, color: "text-[#10B981]" },
    NextAuth: { icon: FaUserShield, color: "text-[#A020F0]" },
    Docker: { icon: FaDocker, color: "text-[#2496ED]" },
};

export const TECH_ICONS_MAP: Record<string, React.ReactNode> = Object.entries(
    ICONS
).reduce((acc, [key, value]) => {
    const Icon = value.icon;
    acc[key] = <Icon className={`w-4 h-4 ${value.color}`} />;
    return acc;
}, {} as Record<string, React.ReactNode>);
export const TECH_STACK_LIST = [
    { name: "React", ...ICONS["React"] },
    { name: "Next.js", ...ICONS["Next.js"] },
    { name: "TypeScript", ...ICONS["TypeScript"] },
    { name: "Tailwind", ...ICONS["Tailwind"] },
    { name: "Node.js", ...ICONS["Node.js"] },
    { name: "MongoDB", ...ICONS["MongoDB"] },
    { name: "Docker", ...ICONS["Docker"] },
    { name: "Firebase", ...ICONS["Firebase"] },
];

// 4. Export Thông tin Profile & Social
export const PROFILE = {
    name: "Huy Boon",
    email: "huybooncode74@gmail.com",
    avatar: "/huybooncode.png",
    social: {
        github: "https://github.com/HuyBoon",
        linkedin: "https://www.linkedin.com/in/huy-boon-438168398/",
    },
};

// 5. Export Danh sách dự án
export const PROJECTS = [
    {
        id: 1,
        title: "Thùy Dương Spa",
        key: "thuyduong",
        tech: ["React", "Next.js", "Tailwind"],
        image: "/projects/thuyduongspa.png",
        demoLink: "https://spathuyduong.vn/vi",
        status: "in_progress",
    },
    {
        id: 2,
        title: "Amazing Phú Quốc",
        key: "amazing",
        tech: ["React", "Node.js", "Tailwind", "Cloudinary", "MongoDB"],
        image: "/projects/amazingphuquoc.png",
        demoLink: "https://hellophuquoc.vn/",
        status: "completed",
    },
    {
        id: 3,
        title: "MK-Nails & Spa",
        key: "mknails",
        tech: ["React", "TypeScript", "Tailwind"],
        image: "/projects/mknails.png",
        demoLink: "https://mknailsportdover.com/",
        status: "completed",
    },
    {
        id: 4,
        title: "Varia Hotel",
        key: "varia",
        tech: ["React", "Next.js", "TypeScript", "Tailwind"],
        image: "/projects/variahotel.png",
        demoLink: "https://varia-nine.vercel.app/",
        status: "in_progress",
    },
    {
        id: 5,
        title: "E-commerce Website",
        key: "ecommerce",
        tech: ["React", "Next.js", "Tailwind"],
        image: "/projects/ecommerce.png",
        demoLink: "https://kimvinhstore.vercel.app/",
        status: "completed",
    },
    {
        id: 6,
        title: "Phú Quốc's Travel",
        key: "tour",
        tech: ["TypeScript", "Node.js", "Tailwind"],
        image: "/projects/tour.png",
        demoLink: "https://hiddensunphuquoc.vercel.app/",
        status: "completed",
    },
    {
        id: 7,
        title: "Blog Platform",
        key: "blog",
        tech: ["Next.js", "MongoDB", "Tailwind", "CSS"],
        image: "/projects/blog.png",
        demoLink: "https://mereview.vercel.app/vi",
        status: "completed",
    },
    {
        id: 8,
        title: "Kyles Skincare",
        key: "skincare",
        tech: ["React", "Next.js", "TypeScript", "Tailwind"],
        image: "/projects/landing.png",
        demoLink: "https://kyleskincare.vn/",
        status: "completed",
    },
];
