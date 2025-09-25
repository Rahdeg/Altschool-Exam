"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Users,
    Search,
    Mail,
    Calendar,
    CheckSquare,
    MessageSquare,
    MessageCircle
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function UserAnalytics() {
    const [searchTerm, setSearchTerm] = useState("");
    const users = useQuery(api.admin.getUserAnalytics);

    if (!users) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                                </div>
                                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStats = {
        totalUsers: users.length,
        totalTodos: users.reduce((sum, user) => sum + user.todoCount, 0),
        totalComments: users.reduce((sum, user) => sum + user.commentCount, 0),
        totalMessages: users.reduce((sum, user) => sum + user.messageCount, 0),
        totalCompletedTodos: users.reduce((sum, user) => sum + user.completedTodos, 0),
        totalActiveTodos: users.reduce((sum, user) => sum + user.activeTodos, 0),
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <Users className="h-10 w-10 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{totalStats.totalUsers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <CheckSquare className="h-10 w-10 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                <p className="text-2xl font-bold">{totalStats.totalTodos}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <MessageSquare className="h-10 w-10 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
                                <p className="text-2xl font-bold">{totalStats.totalComments}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User List */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Details
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-6">
                                    <div className="flex items-center space-x-3">
                                        <Avatar>
                                            <AvatarImage src={user.image} alt={user.name || "User"} />
                                            <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{user.name || "Unknown User"}</h3>
                                            {user.email && (
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs lg:flex-1 lg:justify-center">
                                        <Badge variant="outline">
                                            <CheckSquare className="h-3 w-3 mr-1" />
                                            {user.todoCount} tasks
                                        </Badge>
                                        <Badge variant="outline">
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            {user.commentCount} comments
                                        </Badge>
                                        <Badge variant="outline">
                                            <MessageCircle className="h-3 w-3 mr-1" />
                                            {user.messageCount} messages
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0">
                                        <div className="flex flex-wrap gap-1">
                                            <Badge variant="secondary" className="text-xs">
                                                {user.completedTodos} done
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {user.activeTodos} active
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {user.completedTodos > 0 && user.todoCount > 0
                                                ? `${Math.round((user.completedTodos / user.todoCount) * 100)}% completion`
                                                : "No tasks"
                                            }
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            Joined {formatDate(user._creationTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
