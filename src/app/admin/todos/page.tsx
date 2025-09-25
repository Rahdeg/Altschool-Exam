import { AdminLayout } from "@/components/admin/admin-layout";
import { TodoAnalytics } from "@/components/admin/analytics/todo-analytics";

export default function AdminTodosPage() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Task Analytics</h1>
                    <p className="text-muted-foreground">
                        Analyze task creation, completion rates, and user productivity
                    </p>
                </div>

                <TodoAnalytics />
            </div>
        </AdminLayout>
    );
}
