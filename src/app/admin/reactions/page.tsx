import { AdminLayout } from "@/components/admin/admin-layout";
import { ReactionAnalytics } from "@/components/admin/analytics/reaction-analytics";

export default function AdminReactionsPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reaction Analytics</h1>
                    <p className="text-muted-foreground">
                        Track emoji usage, engagement patterns, and popular reactions
                    </p>
                </div>

                <ReactionAnalytics />
            </div>
        </AdminLayout>
    );
}
