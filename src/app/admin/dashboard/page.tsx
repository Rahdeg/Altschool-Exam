import { AdminLayout } from "@/components/admin/admin-layout";
import { OverviewCards } from "@/components/admin/analytics/overview-cards";

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Monitor and analyze your TaskyFlow application metrics
                    </p>
                </div>

                <OverviewCards />

            </div>
        </AdminLayout>
    );
}
