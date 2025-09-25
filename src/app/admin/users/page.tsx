import { AdminLayout } from "@/components/admin/admin-layout";
import { UserAnalytics } from "@/components/admin/analytics/user-analytics";

export default function AdminUsersPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
                    <p className="text-muted-foreground">
                        Monitor user activity, engagement, and performance metrics
                    </p>
                </div>

                <UserAnalytics />
            </div>
        </AdminLayout>
    );
}
