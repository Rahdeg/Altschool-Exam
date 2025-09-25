"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, BarChart3 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function ReactionAnalytics() {
    const analytics = useQuery(api.admin.getReactionAnalytics);

    if (!analytics) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5" />
                                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(5)].map((_, j) => (
                                    <div key={j} className="flex items-center justify-between">
                                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const getEmojiColor = (emoji: string) => {
        // Simple color assignment based on emoji
        const colors = [
            "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500",
            "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
        ];
        const index = emoji.charCodeAt(0) % colors.length;
        return colors[index];
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
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <Heart className="h-10 w-10 text-red-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Reactions</p>
                                <p className="text-2xl font-bold">{analytics.totalReactions}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <BarChart3 className="h-10 w-10 text-blue-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Unique Emojis</p>
                                <p className="text-2xl font-bold">{analytics.uniqueEmojis}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <TrendingUp className="h-10 w-10 text-green-500" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg per Emoji</p>
                                <p className="text-2xl font-bold">
                                    {analytics.uniqueEmojis > 0
                                        ? Math.round(analytics.totalReactions / analytics.uniqueEmojis)
                                        : 0
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Emojis */}
            <Card>
                <CardHeader className=" space-y-4">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Most Popular Emojis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.popularEmojis.map((item, index) => {
                            const percentage = (item.count / analytics.totalReactions) * 100;
                            return (
                                <div key={item.emoji} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <span className="font-medium">#{index + 1}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary">
                                                {item.count} reactions
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {percentage.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getEmojiColor(item.emoji)} ${getWidthClass(percentage)}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {analytics.popularEmojis.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No reactions found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* All Emojis */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        All Emoji Statistics
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                        {analytics.emojiStats
                            .sort((a, b) => b.count - a.count)
                            .map((item) => (
                                <div key={item.emoji} className="text-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="text-2xl mb-2">{item.emoji}</div>
                                    <div className="text-lg font-semibold">{item.count}</div>
                                    <div className="text-xs text-muted-foreground">reactions</div>
                                </div>
                            ))}

                        {analytics.emojiStats.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No emoji reactions found.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
