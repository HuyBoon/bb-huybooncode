import { auth } from "@/auth";
import connectDB from "@/libs/db";
import User from "@/models/User";
import { ProfileForm } from "@/components/user/ProfileForm";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import { ChangePasswordForm } from "@/components/user/ChangePasswordForm";

interface UserProfile {
    _id: string; // Mongoose luôn trả về _id trừ khi tắt nó
    name: string;
    email: string;
    image?: string;
    role: string;
    provider: string;
    createdAt: Date; // lean() trả về Date object của JS
}
async function getUserProfile(userId: string): Promise<UserProfile | null> {
    await connectDB();

    const user = (await User.findById(userId)
        .select("name email role image createdAt provider")
        .lean()) as unknown as UserProfile | null;

    return user;
}

export default async function ProfilePage() {
    const session = await auth();
    // Fetch dữ liệu mới nhất từ DB thay vì tin tưởng Session cũ
    const user = await getUserProfile(session?.user?.id as string);

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">
                    Hồ sơ cá nhân
                </h3>
                <p className="text-muted-foreground">
                    Quản lý thông tin tài khoản và cài đặt bảo mật.
                </p>
            </div>
            <Separator />

            <div className="flex flex-col md:flex-row gap-8">
                {/* --- Cột trái: Thông tin tóm tắt --- */}
                <aside className="w-full md:w-70 flex flex-col gap-6">
                    <Card className="text-center overflow-hidden">
                        <div className="h-24 bg-primary/10 w-full"></div>
                        <div className="px-6 pb-6 -mt-10">
                            <Avatar className="w-20 h-20 border-4 border-background mx-auto">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="text-xl font-bold">
                                    {user.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="mt-3 space-y-1">
                                <h3 className="font-bold text-lg">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="uppercase text-[10px]"
                                >
                                    {user.role}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                >
                                    Member
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <div className="text-sm text-muted-foreground px-2">
                        <p>Tham gia từ:</p>
                        <p className="font-medium text-foreground">
                            {/* @ts-ignore: createdAt tồn tại trong Mongoose doc */}
                            {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN"
                            )}
                        </p>
                    </div>
                </aside>

                {/* --- Cột phải: Form chỉnh sửa --- */}
                <div className="flex-1">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="general">
                                Thông tin chung
                            </TabsTrigger>
                            <TabsTrigger value="security">Bảo mật</TabsTrigger>
                        </TabsList>

                        {/* Tab 1: Đổi tên */}
                        <TabsContent value="general">
                            <ProfileForm
                                user={{ name: user.name, email: user.email }}
                            />
                        </TabsContent>

                        <TabsContent value="security">
                            {/* Kiểm tra Provider, nếu là credentials mới cho hiện form */}
                            {user.provider === "credentials" ? (
                                <ChangePasswordForm />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/30 text-center space-y-3">
                                    <div className="p-3 bg-background rounded-full shadow-sm">
                                        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold">
                                        Đăng nhập qua Mạng xã hội
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Bạn đang đăng nhập bằng tài khoản{" "}
                                        <strong>Google/Github</strong>. Vui lòng
                                        thay đổi mật khẩu trực tiếp tại nhà cung
                                        cấp dịch vụ đó.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
