import { AdminLayout } from "@/components/admin/admin-layout";
import { ChatAnalytics } from "@/components/admin/analytics/chat-analytics";

export default function AdminChatPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Chat Analytics</h1>
                    <p className="text-muted-foreground">
                        Monitor conversations, message activity, and communication patterns
                    </p>
                </div>

                <ChatAnalytics />
            </div>
        </AdminLayout>
    );
}
