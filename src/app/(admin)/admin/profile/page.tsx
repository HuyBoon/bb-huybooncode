import { auth } from "@/auth";
import connectDB from "@/libs/db";
import User from "@/models/User";
import { AdminProfileForm } from "@/components/admin/profile/AdminProfileForm";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, KeyRound, UserCog } from "lucide-react";
import { ChangePasswordForm } from "@/components/user/ChangePasswordForm";

interface AdminData {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    provider: string;
    createdAt: Date;
}

async function getAdminProfile(userId: string) {
    await connectDB();
    const user = (await User.findById(userId)
        .select("name email role image createdAt provider")
        .lean()) as unknown as AdminData | null;
    return user;
}

export default async function AdminProfilePage() {
    const session = await auth();
    const user = await getAdminProfile(session?.user?.id as string);

    if (!user) return null;

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Hồ sơ của tôi
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý thông tin cá nhân và bảo mật tài khoản Admin.
                    </p>
                </div>
            </div>

            <Separator />

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-[320px] flex flex-col gap-6">
                    <Card className="overflow-hidden border-primary/20 shadow-sm p-0">
                        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/10 to-background"></div>
                        <div className="px-6 pb-6 -mt-12 relative">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                                    {user.name?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="mt-4 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-xl truncate">
                                        {user.name}
                                    </h3>
                                    <ShieldCheck className="text-primary h-5 w-5" />
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                <Badge className="uppercase tracking-wider px-3 py-1">
                                    {user.role}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                    {user.provider}
                                </Badge>
                            </div>

                            <div className="mt-6 pt-6 border-t text-xs text-muted-foreground flex justify-between">
                                <span>Tham gia:</span>
                                <span className="font-medium text-foreground">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        </div>
                    </Card>
                </aside>

                {/* --- CỘT PHẢI: FORM --- */}
                <div className="flex-1">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="mb-4 w-full justify-start">
                            <TabsTrigger value="general" className="gap-2">
                                <UserCog size={16} /> Thông tin chung
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-2">
                                <KeyRound size={16} /> Bảo mật
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <AdminProfileForm
                                user={{ name: user.name, email: user.email }}
                            />
                        </TabsContent>

                        <TabsContent value="security">
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
