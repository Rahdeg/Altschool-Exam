import { AdminLayout } from "@/components/admin/admin-layout";
import { CommentAnalytics } from "@/components/admin/analytics/comment-analytics";

export default function AdminCommentsPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Comment Analytics</h1>
                    <p className="text-muted-foreground">
                        Track comment activity, engagement, and user interactions
                    </p>
                </div>

                <CommentAnalytics />
            </div>
        </AdminLayout>
    );
}
