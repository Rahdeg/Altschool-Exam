"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageSquare,
    ThumbsUp,
    CheckCircle,
    Calendar,
    User,
    AtSign,
    Settings,
    X,
    Bell,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { NotificationSettings } from "./notification-settings";

interface NotificationPanelProps {
    onMarkAllAsRead: () => void;
    onClose: () => void;
}


const getNotificationIcon = (type: string) => {
    switch (type) {
        case "TASK_COMMENT":
        case "COMMENT_REPLY":
            return <MessageSquare className="h-4 w-4" />;
        case "REACTION_ADDED":
            return <ThumbsUp className="h-4 w-4" />;
        case "TASK_STATUS_CHANGE":
            return <CheckCircle className="h-4 w-4" />;
        case "TASK_DUE_SOON":
            return <Calendar className="h-4 w-4" />;
        case "NEW_MESSAGE":
            return <MessageSquare className="h-4 w-4" />;
        case "TASK_MENTION":
            return <AtSign className="h-4 w-4" />;
        default:
            return <User className="h-4 w-4" />;
    }
};

const getNotificationColor = (type: string) => {
    switch (type) {
        case "TASK_COMMENT":
        case "COMMENT_REPLY":
            return "text-blue-600 bg-blue-100";
        case "REACTION_ADDED":
            return "text-yellow-600 bg-yellow-100";
        case "TASK_STATUS_CHANGE":
            return "text-green-600 bg-green-100";
        case "TASK_DUE_SOON":
            return "text-orange-600 bg-orange-100";
        case "NEW_MESSAGE":
            return "text-purple-600 bg-purple-100";
        case "TASK_MENTION":
            return "text-pink-600 bg-pink-100";
        default:
            return "text-gray-600 bg-gray-100";
    }
};

export function NotificationPanel({ onMarkAllAsRead, onClose }: NotificationPanelProps) {
    const [showSettings, setShowSettings] = useState(false);

    const notifications = useQuery(api.notifications.getMyNotifications, { limit: 20 });
    const markAsRead = useMutation(api.notifications.markAsRead);
    const removeNotification = useMutation(api.notifications.remove);

    const handleMarkAsRead = async (notificationId: Id<"notifications">) => {
        try {
            await markAsRead({ notificationId });
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            toast.error("Failed to mark notification as read");
        }
    };

    const handleRemoveNotification = async (notificationId: Id<"notifications">) => {
        try {
            await removeNotification({ notificationId });
        } catch (error) {
            console.error("Failed to remove notification:", error);
            toast.error("Failed to remove notification");
        }
    };

    const formatTimeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    if (showSettings) {
        return <NotificationSettings onClose={() => setShowSettings(false)} />;
    }

    if (notifications === undefined) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {unreadCount} new
                        </Badge>
                    )}
                </div>
                <div className="flex items-center space-x-1">
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMarkAllAsRead}
                            className="text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="max-h-[400px]">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-4 hover:bg-muted/50 transition-colors ${!notification.isRead ? "bg-blue-50/50" : ""
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    {/* Icon */}
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(
                                            notification.type
                                        )}`}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    {notification.actor.name && (
                                                        <div className="flex items-center space-x-1">
                                                            <Avatar className="h-4 w-4">
                                                                <AvatarImage src={notification.actor.image} />
                                                                <AvatarFallback className="text-xs">
                                                                    {notification.actor.name?.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-xs text-muted-foreground">
                                                                {notification.actor.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-1 ml-2">
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification._id)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <CheckCircle className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveNotification(notification._id)}
                                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowSettings(true)}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Notification Settings
                </Button>
            </div>
        </div>
    );
}
