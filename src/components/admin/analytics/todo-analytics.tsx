"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckSquare,
    Search,
    Calendar,
    MessageSquare,
    Heart,
    User,
    Clock,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function TodoAnalytics() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const todos = useQuery(api.admin.getTodoAnalytics);

    if (!todos) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        Todo Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || todo.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "TODO": return "bg-blue-500";
            case "IN_PROGRESS": return "bg-yellow-500";
            case "DONE": return "bg-green-500";
            case "CANCELLED": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "LOW": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "MEDIUM": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
            case "HIGH": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "TODO", label: "To Do" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "DONE", label: "Done" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <CheckSquare className="h-10 w-10 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{todos.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <MessageSquare className="h-10 w-10 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
                                <p className="text-2xl font-bold">
                                    {todos.reduce((sum, todo) => sum + todo.commentCount, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <Heart className="h-10 w-10 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Reactions</p>
                                <p className="text-2xl font-bold">
                                    {todos.reduce((sum, todo) => sum + todo.reactionCount, 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <User className="h-10 w-10 text-purple-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Creators</p>
                                <p className="text-2xl font-bold">
                                    {new Set(todos.map(todo => todo.userId)).size}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Task List */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        Task Details
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex space-x-1">
                            {statusOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={statusFilter === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(option.value)}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredTodos.map((todo) => (
                            <div key={todo._id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-lg truncate">{todo.title}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <Badge className={`${getStatusColor(todo.status)} text-white text-xs`}>
                                                    {todo.status.replace("_", " ")}
                                                </Badge>
                                                <Badge variant="outline" className={`${getPriorityColor(todo.priority)} text-xs`}>
                                                    {todo.priority}
                                                </Badge>
                                                {todo.isPublic && (
                                                    <Badge variant="secondary" className="text-xs">Public</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Badge variant="outline" className="text-xs">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                {todo.commentCount}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                <Heart className="h-3 w-3 mr-1" />
                                                {todo.reactionCount}
                                            </Badge>
                                        </div>
                                    </div>

                                    {todo.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {todo.description}
                                        </p>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {todo.creatorName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Created {formatDate(todo.createdAt)}
                                            </span>
                                            {todo.dueDate && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Due {formatDate(todo.dueDate)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Updated {formatDate(todo.updatedAt)}
                                        </div>
                                    </div>

                                    {todo.tags && todo.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {todo.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredTodos.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tasks found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
