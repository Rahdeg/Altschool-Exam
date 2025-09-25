"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    CheckSquare,
    MessageSquare,
    MessageCircle,
    TrendingUp,
    Activity
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function OverviewCards() {
    const analytics = useQuery(api.admin.getAnalyticsOverview);

    if (!analytics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                            </CardTitle>
                            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Users",
            value: analytics.totalUsers,
            icon: Users,
            description: `${analytics.recentUsers} new this week`,
            trend: analytics.recentUsers > 0 ? "up" : "neutral",
        },
        {
            title: "Total Tasks",
            value: analytics.totalTodos,
            icon: CheckSquare,
            description: `${analytics.recentTodos} created this week`,
            trend: analytics.recentTodos > 0 ? "up" : "neutral",
        },
        {
            title: "Total Comments",
            value: analytics.totalComments,
            icon: MessageSquare,
            description: `${analytics.recentComments} this week`,
            trend: analytics.recentComments > 0 ? "up" : "neutral",
        },
        {
            title: "Total Messages",
            value: analytics.totalMessages,
            icon: MessageCircle,
            description: `${analytics.totalConversations} conversations`,
            trend: "neutral",
        },
    ];

    const statusCards = [
        {
            title: "Tasks by Status",
            data: analytics.todosByStatus,
            icon: Activity,
        },
        {
            title: "Tasks by Priority",
            data: analytics.todosByPriority,
            icon: TrendingUp,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "TODO": return "bg-blue-500";
            case "IN_PROGRESS": return "bg-yellow-500";
            case "DONE": return "bg-green-500";
            case "CANCELLED": return "bg-red-500";
            case "LOW": return "bg-green-500";
            case "MEDIUM": return "bg-yellow-500";
            case "HIGH": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    const getWidthClass = (percentage: number) => {
        if (percentage >= 90) return "w-[90%]";
        if (percentage >= 80) return "w-[80%]";
        if (percentage >= 70) return "w-[70%]";
        if (percentage >= 60) return "w-[60%]";
        if (percentage >= 50) return "w-[50%]";
        if (percentage >= 40) return "w-[40%]";
        if (percentage >= 30) return "w-[30%]";
        if (percentage >= 20) return "w-[20%]";
        if (percentage >= 10) return "w-[10%]";
        return "w-[5%]";
    };

    return (
        <div className="space-y-6">
            {/* Main metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    {card.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Status breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {statusCards.map((card) => {
                    const Icon = card.icon;
                    const total = Object.values(card.data).reduce((sum, count) => sum + count, 0);

                    return (
                        <Card key={card.title}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Icon className="h-5 w-5" />
                                    {card.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(card.data).map(([key, value]) => {
                                        const percentage = total > 0 ? (value / total) * 100 : 0;
                                        return (
                                            <div key={key} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="capitalize">{key.toLowerCase()}</span>
                                                    <span className="font-medium">{value}</span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getStatusColor(key)} ${getWidthClass(percentage)}`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
