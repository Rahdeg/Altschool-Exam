"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MessageCircle,
    Users,
    MessageSquare,
    Activity,
    Calendar,
    Clock
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function ChatAnalytics() {
    const analytics = useQuery(api.admin.getChatAnalytics);

    if (!analytics) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="flex items-center space-x-4 p-4 border rounded-lg">
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
                ))}
            </div>
        );
    }

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

    const getActivityBadge = (lastActivity: number) => {
        const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
        if (daysSinceActivity < 1) {
            return <Badge className="bg-green-500">Active Today</Badge>;
        } else if (daysSinceActivity < 7) {
            return <Badge className="bg-yellow-500">Active This Week</Badge>;
        } else {
            return <Badge variant="secondary">Inactive</Badge>;
        }
    };

    const getTypeIcon = (type: string) => {
        return type === "dm" ? <Users className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <MessageCircle className="h-10 w-10 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
                                <p className="text-2xl font-bold">{analytics.totalConversations}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <MessageSquare className="h-10 w-10 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                                <p className="text-2xl font-bold">{analytics.totalMessages}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <Activity className="h-10 w-10 text-orange-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
                                <p className="text-2xl font-bold">{analytics.activeConversations}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Conversation Details */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Conversation Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.conversationsWithStats.map((conversation) => (
                            <div key={conversation._id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                {/* Mobile-first responsive layout */}
                                <div className="space-y-3">
                                    {/* Header with type and status - mobile optimized */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <div className="flex items-center space-x-2">
                                                {getTypeIcon(conversation.type)}
                                                <h3 className="font-medium text-base">
                                                    {conversation.type === "dm" ? "Direct Message" : "Group Chat"}
                                                </h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {conversation.participants.length} participants
                                                </Badge>
                                                {getActivityBadge(conversation.lastActivity)}
                                            </div>
                                        </div>

                                        {/* Message count - moved to top on mobile */}
                                        <div className="flex sm:flex-col items-center sm:items-end gap-2">
                                            <Badge variant="outline" className="text-sm">
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                {conversation.messageCount} messages
                                            </Badge>
                                            <div className="text-xs text-muted-foreground">
                                                {conversation.messageCount > 0
                                                    ? `${Math.round(analytics.totalMessages / analytics.totalConversations)} avg/conv`
                                                    : "No messages"
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details - stacked on mobile, inline on desktop */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">Created by {conversation.creatorName}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">
                                                Started {formatDate(conversation.createdAt)} at {formatTime(conversation.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">
                                                Last activity {formatDate(conversation.lastActivity)} at {formatTime(conversation.lastActivity)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Participants - improved mobile layout */}
                                    {conversation.participants.length > 0 && (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <span className="text-sm text-muted-foreground font-medium">Participants:</span>
                                            <div className="flex -space-x-1 sm:-space-x-2">
                                                {conversation.participants.slice(0, 5).map((participantId) => (
                                                    <Avatar key={participantId} className="h-8 w-8 sm:h-6 sm:w-6 border-2 border-background">
                                                        <AvatarFallback className="text-xs font-medium">
                                                            {getInitials(participantId)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {conversation.participants.length > 5 && (
                                                    <div className="h-8 w-8 sm:h-6 sm:w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                                        <span className="text-xs font-medium">
                                                            +{conversation.participants.length - 5}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {analytics.conversationsWithStats.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No conversations found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Activity Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Active Conversations</span>
                            <span className="font-medium">{analytics.activeConversations}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Inactive Conversations</span>
                            <span className="font-medium">
                                {analytics.totalConversations - analytics.activeConversations}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Average Messages per Conversation</span>
                            <span className="font-medium">
                                {analytics.totalConversations > 0
                                    ? Math.round(analytics.totalMessages / analytics.totalConversations)
                                    : 0
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Activity Rate</span>
                            <span className="font-medium">
                                {analytics.totalConversations > 0
                                    ? `${Math.round((analytics.activeConversations / analytics.totalConversations) * 100)}%`
                                    : "0%"
                                }
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Message Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Direct Messages</span>
                            <span className="font-medium">
                                {analytics.conversationsWithStats.filter(c => c.type === "dm").length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Group Chats</span>
                            <span className="font-medium">
                                {analytics.conversationsWithStats.filter(c => c.type === "group").length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Most Active Conversation</span>
                            <span className="font-medium">
                                {analytics.conversationsWithStats.length > 0
                                    ? Math.max(...analytics.conversationsWithStats.map(c => c.messageCount))
                                    : 0
                                } messages
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
