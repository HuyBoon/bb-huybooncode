export interface IImage {
    imgUrl: string;
    public_id: string;
}

export interface IPlainCategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    type: "post" | "project" | "template";

    status: "active" | "inactive";
    parent?: { _id: string; name: string } | null;
    ancestors?: string[];
    depth?: number;
    children?: IPlainCategory[];
    createdAt: string;
    updatedAt: string;
}

export interface IPlainPost {
    _id: string;
    title: string;
    slug: string;
    category: IPlainCategory | null;
    metaDescription: string;
    content: string;
    thumbnail: IImage;
    tags: string[];
    author: string;
    lessonId?: number;
    timeRead: string;
    status: "draft" | "published";
    publishedDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPlainProject {
    _id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnail: IImage;
    gallery: IImage[];

    category: IPlainCategory | null;

    techStack: string[];
    client?: string;
    demoUrl?: string;
    repoUrl?: string;

    isFeatured: boolean;
    status: "completed" | "in-progress";
    completionDate?: string;

    createdAt: string;
    updatedAt: string;
}

export interface IPlainWebTemplate {
    _id: string;
    name: string;
    slug: string;
    description: string;
    thumbnail: IImage;
    screenshots: IImage[];

    category: IPlainCategory | null;

    features: string[];
    previewUrl: string;
    price: number;
    isFree: boolean;
    technologies: string[];

    status: "available" | "coming-soon";
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    page: number;
    totalPages: number;
    total: number;
}

export interface IActionResponse<T> {
    success?: boolean;
    data?: T;
    pagination?: IPagination;
    error?: string;
    message?: string;
}
