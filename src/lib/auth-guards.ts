import { auth } from "@/auth";

type UserRole = "admin" | "user" | "superAdmin";

export async function requireRoles(allowedRoles: UserRole[]) {
    const session = await auth();

    if (!session || !session.user || !session.user.role) {
        throw new Error("Unauthorized: Vui lòng đăng nhập.");
    }
    if (!allowedRoles.includes(session.user.role as UserRole)) {
        throw new Error(
            "Forbidden: Bạn không có quyền thực hiện hành động này."
        );
    }

    return session.user;
}
export async function requireAdmin() {
    return requireRoles(["admin", "superAdmin"]);
}
