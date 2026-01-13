"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Folder, FolderOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPlainCategory } from "@/types/backend";

function buildTree(items: IPlainCategory[]) {
    const rootItems: IPlainCategory[] = [];
    const lookup: Record<string, IPlainCategory> = {};

    const copyItems = items.map((i) => ({ ...i, children: [] }));

    for (const item of copyItems) {
        lookup[item._id] = item;
    }

    for (const item of copyItems) {
        const parentId = item.parent?._id;

        if (parentId && typeof parentId === "string" && lookup[parentId]) {
            lookup[parentId].children?.push(item);
        } else {
            rootItems.push(item);
        }
    }
    return rootItems;
}

const CategoryItem = ({
    node,
    currentSlug,
    level = 0,
}: {
    node: IPlainCategory;
    currentSlug: string;
    level?: number;
}) => {
    const isActive = currentSlug === node.slug;
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="w-full">
            <Link
                href={`/knowledge?category=${node.slug}`}
                className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors hover:bg-muted",
                    isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                )}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
            >
                {isActive ? <FolderOpen size={16} /> : <Folder size={16} />}
                <span className="flex-1 truncate">{node.name}</span>
                {isActive && <ChevronRight size={14} />}
            </Link>

            {hasChildren && (
                <div className="border-l border-border/50 ml-4 my-1">
                    {node.children?.map((child) => (
                        <CategoryItem
                            key={child._id}
                            node={child}
                            currentSlug={currentSlug}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function CategorySidebar({
    categories,
}: {
    categories: IPlainCategory[];
}) {
    const searchParams = useSearchParams();
    const currentSlug = searchParams.get("category") || "";
    const treeData = buildTree(categories);

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg px-2">Danh mục</h3>
            <div className="flex flex-col space-y-1">
                <Link
                    href="/knowledge"
                    className={cn(
                        "flex items-center gap-2 py-2 px-3 rounded-md text-sm hover:bg-muted font-medium",
                        !currentSlug
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                    )}
                >
                    <Folder size={16} />
                    Tất cả bài viết
                </Link>
                {treeData.map((node) => (
                    <CategoryItem
                        key={node._id}
                        node={node}
                        currentSlug={currentSlug}
                    />
                ))}
            </div>
        </div>
    );
}
