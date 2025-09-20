"use client";

import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { TodoList } from "./todo-list";
import { ChatSidebar } from "./chat-sidebar";
import { TodoForm } from "@/components/forms/todo-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function Dashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader />

            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
                                <p className="text-gray-600">Manage your tasks and stay organized</p>
                            </div>
                            <Button onClick={() => setShowCreateModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Task
                            </Button>
                        </div>

                        <TodoList />
                    </div>
                </div>

                {/* Chat Sidebar */}
                <div className="w-80 border-l bg-white">
                    <ChatSidebar />
                </div>
            </div>

            {/* Create Task Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Create New Task</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowCreateModal(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <TodoForm onSuccess={() => setShowCreateModal(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
