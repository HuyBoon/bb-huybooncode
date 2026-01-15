import { auth } from "@/auth";

// Định nghĩa role nếu chưa có type toàn cục
type UserRole = "admin" | "user" | "superAdmin";

export async function requireRoles(allowedRoles: UserRole[]) {
    const session = await auth();

    // Dùng Optional Chaining (?.) để tránh lỗi crash nếu session null
    if (!session?.user?.role) {
        throw new Error("Unauthorized: Vui lòng đăng nhập.");
    }

    // Ép kiểu role để so sánh
    const userRole = session.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
        throw new Error(
            "Forbidden: Bạn không có quyền thực hiện hành động này."
        );
    }

    return session.user;
}

export async function requireAdmin() {
    return requireRoles(["admin", "superAdmin"]);
}
