"use client";

import { useState, useTransition, useMemo } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import {
    Trash2,
    Edit,
    ChevronRight,
    ChevronDown,
    Plus,
    FolderTree,
    Layout,
    FileText,
    Briefcase,
} from "lucide-react";
import { deleteCategory } from "@/actions/category-actions";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CategoryForm } from "./CategoryForm";

function buildTree(items: any[]) {
    const rootItems: any[] = [];
    const lookup: Record<string, any> = {};

    for (const item of items) {
        lookup[item._id] = { ...item, children: [] };
    }

    for (const item of items) {
        if (item.parent?._id && lookup[item.parent._id]) {
            lookup[item.parent._id].children.push(lookup[item._id]);
        } else {
            rootItems.push(lookup[item._id]);
        }
    }
    return rootItems;
}

const CategoryRow = ({
    node,
    level = 0,
    expandedIds,
    toggleExpand,
    onEdit,
    onDelete,
}: {
    node: any;
    level?: number;
    expandedIds: Record<string, boolean>;
    toggleExpand: (id: string) => void;
    onEdit: (cat: any) => void;
    onDelete: (id: string) => void;
}) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds[node._id];

    return (
        <div className="flex flex-col">
            <div
                className={cn(
                    "flex items-center justify-between p-3 border-b hover:bg-muted/50 transition-colors",
                    level === 0 && "bg-muted/10 font-medium"
                )}
                style={{ paddingLeft: `${level * 24 + 12}px` }}
            >
                <div className="flex items-center gap-2">
                    {hasChildren ? (
                        <button
                            onClick={() => toggleExpand(node._id)}
                            className="p-1 hover:bg-muted rounded-sm text-muted-foreground"
                        >
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </button>
                    ) : (
                        <span className="w-6" />
                    )}

                    <span className="truncate max-w-40 sm:max-w-md font-medium text-foreground/90">
                        {node.name}
                    </span>

                    {/* Badge Trạng thái ẩn */}
                    {node.status === "inactive" && (
                        <Badge
                            variant="secondary"
                            className="ml-2 text-[10px] h-5"
                        >
                            Ẩn
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="hidden sm:inline-block text-xs">
                        {format(new Date(node.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                        })}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onEdit(node)}
                        >
                            <Edit size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(node._id)}
                        >
                            <Trash2 size={14} />
                        </Button>
                    </div>
                </div>
            </div>

            {hasChildren && isExpanded && (
                <div className="border-l border-muted ml-5.5">
                    {node.children.map((child: any) => (
                        <CategoryRow
                            key={child._id}
                            node={child}
                            level={level + 1}
                            expandedIds={expandedIds}
                            toggleExpand={toggleExpand}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CategoryTabContent = ({
    data,
    onEdit,
    onDelete,
}: {
    data: any[];
    onEdit: (cat: any) => void;
    onDelete: (id: string) => void;
}) => {
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const treeData = useMemo(() => buildTree(data), [data]);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    if (treeData.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center border rounded-md border-dashed bg-muted/20 mt-4">
                <FolderTree className="h-10 w-10 mb-2 opacity-20" />
                <p>Chưa có danh mục nào.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card mt-4">
            <div className="flex items-center justify-between p-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                <div className="pl-9">Tên danh mục</div>
                <div className="pr-12">Hành động</div>
            </div>
            {treeData.map((node) => (
                <CategoryRow
                    key={node._id}
                    node={node}
                    expandedIds={expandedIds}
                    toggleExpand={toggleExpand}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export function CategoryTreeList({ data }: { data: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);

    // Lưu tab hiện tại để khi tạo mới mặc định chọn type tương ứng
    const [activeTab, setActiveTab] = useState("post");

    const handleDelete = (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        startTransition(async () => {
            const res = await deleteCategory(id);
            if (res.success) toast.success(res.message);
            else toast.error(res.error);
        });
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsSheetOpen(true);
    };

    const handleCreate = () => {
        setEditingCategory({ type: activeTab });
        setIsSheetOpen(true);
    };

    const postCategories = data.filter((c) => c.type === "post" || !c.type);
    const projectCategories = data.filter((c) => c.type === "project");
    const templateCategories = data.filter((c) => c.type === "template");
    const studyCategories = data.filter((c) => c.type === "study");

    return (
        <>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="text-muted-foreground text-sm">
                    Quản lý danh mục theo từng phân hệ.
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
                </Button>
            </div>

            <Tabs
                defaultValue="post"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4 max-w-lg">
                    <TabsTrigger
                        value="post"
                        className="flex items-center gap-2"
                    >
                        <FileText size={16} /> Blog
                        <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 h-5 text-[10px]"
                        >
                            {postCategories.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="project"
                        className="flex items-center gap-2"
                    >
                        <Briefcase size={16} /> Project
                        <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 h-5 text-[10px]"
                        >
                            {projectCategories.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="template"
                        className="flex items-center gap-2"
                    >
                        <Layout size={16} /> Template
                        <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 h-5 text-[10px]"
                        >
                            {templateCategories.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="study"
                        className="flex items-center gap-2"
                    >
                        <Layout size={16} /> Study
                        <Badge
                            variant="secondary"
                            className="ml-1 px-1.5 h-5 text-[10px]"
                        >
                            {studyCategories.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="post">
                    <CategoryTabContent
                        data={postCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>

                <TabsContent value="project">
                    <CategoryTabContent
                        data={projectCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>

                <TabsContent value="template">
                    <CategoryTabContent
                        data={templateCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>
                <TabsContent value="study">
                    <CategoryTabContent
                        data={studyCategories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </TabsContent>
            </Tabs>

            <CategoryForm
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                existingCategories={data}
                editingCategory={editingCategory}
            />
        </>
    );
}
