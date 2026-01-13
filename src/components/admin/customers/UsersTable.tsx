"use client";

import { useState, useTransition } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Trash2,
    Shield,
    User as UserIcon,
    Search,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 
import { toggleUserRole, deleteUser } from "@/actions/admin-users-actions";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface UserType {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt: string;
    provider: string;
}

interface UsersTableProps {
    initialUsers: UserType[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleRole = (userId: string, currentRole: string) => {
        startTransition(async () => {
            const result = await toggleUserRole(userId, currentRole);
            if (result.success) {
                toast.success(result.message);

                setUsers((prev) =>
                    prev.map((u) =>
                        u._id === userId
                            ? {
                                  ...u,
                                  role:
                                      currentRole === "admin"
                                          ? "user"
                                          : "admin",
                              }
                            : u
                    )
                );
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleDelete = (userId: string) => {
        if (
            !confirm(
                "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
            )
        )
            return;

        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success(result.message);
                setUsers((prev) => prev.filter((u) => u._id !== userId));
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Tổng: <strong>{filteredUsers.length}</strong> người dùng
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Avatar</TableHead>
                            <TableHead>Thông tin</TableHead>
                            <TableHead>Vai trò</TableHead>
                            <TableHead>Đăng nhập</TableHead>
                            <TableHead>Ngày tham gia</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={user.image}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>
                                                {user.name?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.role === "admin" ? (
                                                <div className="flex items-center gap-1">
                                                    <Shield size={12} /> Admin
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <UserIcon size={12} /> User
                                                </div>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className="capitalize"
                                        >
                                            {user.provider}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {user.createdAt
                                            ? format(
                                                  new Date(user.createdAt),
                                                  "dd/MM/yyyy",
                                                  { locale: vi }
                                              )
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <span className="sr-only">
                                                        Open menu
                                                    </span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>
                                                    Hành động
                                                </DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleToggleRole(
                                                            user._id,
                                                            user.role
                                                        )
                                                    }
                                                    disabled={isPending}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {user.role === "admin"
                                                        ? "Hạ xuống User"
                                                        : "Thăng cấp Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDelete(user._id)
                                                    }
                                                    className="text-destructive focus:text-destructive"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Xóa người dùng
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center"
                                >
                                    Không tìm thấy kết quả nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
