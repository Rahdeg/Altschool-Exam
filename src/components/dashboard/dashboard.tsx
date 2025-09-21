"use client";

import { useState } from "react";
import { DashboardHeader } from "./dashboard-header";
import { TodoList } from "./todo-list";
import { ChatSidebar } from "./chat-sidebar";
import { TodoForm } from "@/components/forms/todo-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

export function Dashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [showChatDrawer, setShowChatDrawer] = useState(false);
    const [filter, setFilter] = useState<"all" | "my" | "public">("all");

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader onChatClick={() => setShowChatDrawer(true)} />

            <div className="flex flex-col lg:flex-row pt-16 h-[calc(100vh-4rem)]">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Fixed My Tasks Section */}
                    <div className="p-4 lg:p-6 bg-white">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
                                    <p className="text-muted-foreground">Manage your tasks and stay organized</p>
                                </div>

                                {/* Mobile: Drawer, Desktop: Modal */}
                                <div className="block lg:hidden">
                                    <Drawer open={showCreateDrawer} onOpenChange={setShowCreateDrawer}>
                                        <DrawerTrigger asChild>
                                            <Button className="w-full sm:w-auto">
                                                <Plus className="w-4 h-4 mr-2" />
                                                New Task
                                            </Button>
                                        </DrawerTrigger>
                                        <DrawerContent side="bottom" className="h-[85vh] p-0 flex flex-col">
                                            <DrawerHeader className="px-4 pt-4 pb-2 flex-shrink-0">
                                                <DrawerTitle>Create New Task</DrawerTitle>
                                            </DrawerHeader>
                                            <div className="px-4 pb-4 overflow-y-auto flex-1 min-h-0">
                                                <TodoForm onSuccess={() => setShowCreateDrawer(false)} />
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </div>

                                <div className="hidden lg:block">
                                    <Button onClick={() => setShowCreateModal(true)}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Task
                                    </Button>
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filter === "all"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    All Tasks
                                </button>
                                <button
                                    onClick={() => setFilter("my")}
                                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filter === "my"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    My Tasks
                                </button>
                                <button
                                    onClick={() => setFilter("public")}
                                    className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${filter === "public"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    Public Tasks
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Tasks Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 lg:p-6">
                            <div className="max-w-4xl mx-auto">
                                <TodoList filter={filter} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Sidebar - Hidden on mobile, visible on large screens */}
                <div className="hidden lg:block lg:w-80 border-l border-border bg-card h-[calc(100vh-4rem)]">
                    <ChatSidebar />
                </div>
            </div>

            {/* Create Task Modal - Desktop only */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-card-foreground">Create New Task</h2>
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

            {/* Mobile Chat Drawer */}
            <Drawer open={showChatDrawer} onOpenChange={setShowChatDrawer}>
                <DrawerContent side="right" className="h-full !w-full">
                    <DrawerHeader className="flex-shrink-0 border-b border-border">
                        <DrawerTitle className="text-lg font-semibold text-card-foreground">
                            Messages
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-1 overflow-hidden">
                        <ChatSidebar />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
