"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MessageSquare,
    Search,
    Calendar,
    User,
    CheckSquare,
    Clock
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function CommentAnalytics() {
    const [searchTerm, setSearchTerm] = useState("");
    const comments = useQuery(api.admin.getCommentAnalytics);

    if (!comments) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comment Analytics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                        <div className="h-16 w-full bg-muted animate-pulse rounded" />
                                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const filteredComments = comments.filter(comment =>
        comment.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.todoTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const truncateText = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    // Group comments by author for stats
    const authorStats = comments.reduce((acc, comment) => {
        const authorId = comment.userId;
        if (!acc[authorId]) {
            acc[authorId] = {
                name: comment.authorName,
                email: comment.authorEmail,
                count: 0,
                totalLength: 0,
            };
        }
        acc[authorId].count++;
        acc[authorId].totalLength += comment.body.length;
        return acc;
    }, {} as Record<string, { name: string; email: string; count: number; totalLength: number }>);

    const topAuthors = Object.entries(authorStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Comments</p>
                                <p className="text-xl sm:text-2xl font-bold">{comments.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <User className="h-8 w-8 sm:h-10 sm:w-10 text-green-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Active Authors</p>
                                <p className="text-xl sm:text-2xl font-bold">{Object.keys(authorStats).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <CheckSquare className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Tasks with Comments</p>
                                <p className="text-xl sm:text-2xl font-bold">
                                    {new Set(comments.map(c => c.todoId)).size}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Avg Comment Length</p>
                                <p className="text-xl sm:text-2xl font-bold">
                                    {comments.length > 0
                                        ? Math.round(comments.reduce((sum, c) => sum + c.body.length, 0) / comments.length)
                                        : 0
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Authors */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Most Active Commenters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topAuthors.map((author, index) => (
                            <div key={author.id} className="p-3 border rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(author.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{author.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">{author.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <Badge variant="outline" className="text-xs w-fit">
                                            <span className="text-lg font-bold">{author.count}</span>
                                            <span className="ml-1">comments</span>
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs w-fit">
                                            <span className="text-lg font-bold">{Math.round(author.totalLength / author.count)}</span>
                                            <span className="ml-1">avg length</span>
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {topAuthors.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No comments found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Comment List */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Recent Comments
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search comments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredComments.slice(0, 20).map((comment) => (
                            <div key={comment._id} className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="flex-shrink-0">
                                            <AvatarFallback className="text-xs">
                                                {getInitials(comment.authorName)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="space-y-2">
                                                <h4 className="font-medium truncate">{comment.authorName}</h4>
                                                <Badge variant="outline" className="text-xs w-fit">
                                                    <CheckSquare className="h-3 w-3 mr-1" />
                                                    <span className="truncate">{comment.todoTitle}</span>
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {truncateText(comment.body, 120)}
                                    </p>

                                    <div className="flex flex-col space-y-2">
                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{formatDate(comment.createdAt)}</span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{formatTime(comment.createdAt)}</span>
                                            </span>
                                        </div>

                                        {comment.body.length > 120 && (
                                            <Badge variant="secondary" className="text-xs w-fit">
                                                {comment.body.length} characters
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredComments.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No comments found matching your search.</p>
                            </div>
                        )}

                        {filteredComments.length > 20 && (
                            <div className="text-center pt-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing first 20 comments. Total: {filteredComments.length}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
