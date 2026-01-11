import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { ProfileCover } from "@/components/user/ProfileCover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import connectDB from "@/libs/db";
import User from "@/models/User";

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    image?: string;
    coverImage?: string;
    role: string;
    provider: string;
    createdAt: Date;
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
    await connectDB();
    const user = (await User.findById(userId)
        .select("name email role image createdAt provider coverImage")
        .lean()) as unknown as UserProfile | null;
    return user;
}

export default async function UserDashboardPage() {
    const session = await auth();

    if (!session?.user) return null;
    const user = await getUserProfile(session.user.id);

    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <Card className="text-center p-0 overflow-hidden border-border/50 shadow-sm">
                {/* Truyền mã màu xuống component */}
                <ProfileCover initialCover={user.coverImage} editable={true} />

                <div className="px-6 pb-6 -mt-10 relative z-10">
                    <Avatar className="w-20 h-20 border-4 border-background mx-auto shadow-md">
                        <AvatarImage
                            src={user.image || ""}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-xl font-bold bg-background">
                            {user.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="mt-3 space-y-1">
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
