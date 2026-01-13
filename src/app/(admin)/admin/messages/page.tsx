import { getMessages } from "@/actions/admin-message-actions";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { MessageList } from "@/components/admin/messages/MessageList";
import { Separator } from "@/components/ui/separator";
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
    const result = await getMessages();
    const messages = result.success ? result.data : [];

    return (
        <div className="flex flex-col gap-6 p-6">
            <AdminBreadcrumb />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Hộp thư khách hàng
                    </h1>
                    <p className="text-muted-foreground">
                        Quản lý tin nhắn liên hệ từ website.
                    </p>
                </div>
            </div>

            <Separator />

            <MessageList initialMessages={messages} />
        </div>
    );
}
