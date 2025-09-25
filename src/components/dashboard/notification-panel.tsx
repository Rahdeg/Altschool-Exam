"use client";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";

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
            return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
        case "REACTION_ADDED":
            return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
        case "TASK_STATUS_CHANGE":
            return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
        case "TASK_DUE_SOON":
            return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
        case "NEW_MESSAGE":
            return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
        case "TASK_MENTION":
            return "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/20";
        default:
            return "text-muted-foreground bg-muted";
    }
};

export function NotificationPanel({ onMarkAllAsRead, onClose }: NotificationPanelProps) {
    const router = useRouter();
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

    const handleSettingsClick = () => {
        onClose(); // Close the notification panel
        router.push("/settings"); // Navigate to settings page
    };

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
                            <div className="w-8 h-8 bg-muted-foreground/10 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted-foreground/10 rounded w-3/4"></div>
                                <div className="h-3 bg-muted-foreground/10 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="w-full bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onMarkAllAsRead}
                            className="text-xs h-8 px-3"
                        >
                            Mark all read
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 hover:bg-muted"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="max-h-[450px]">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                            <Bell className="h-8 w-8 opacity-60" />
                        </div>
                        <h4 className="text-sm font-medium text-foreground mb-1">No notifications yet</h4>
                        <p className="text-xs text-muted-foreground">You&apos;ll see updates about your tasks and messages here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`group p-5 hover:bg-muted/30 transition-all duration-200 cursor-pointer ${!notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""
                                    }`}
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Icon */}
                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${getNotificationColor(
                                            notification.type
                                        )}`}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-foreground leading-tight">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {notification.actor.name && (
                                                            <div className="flex items-center space-x-2">
                                                                <Avatar className="h-5 w-5">
                                                                    <AvatarImage src={notification.actor.image} />
                                                                    <AvatarFallback className="text-xs font-medium">
                                                                        {notification.actor.name?.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-xs font-medium text-foreground">
                                                                    {notification.actor.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground font-medium">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification._id);
                                                        }}
                                                        className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
                                                        title="Mark as read"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveNotification(notification._id);
                                                    }}
                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    title="Remove notification"
                                                >
                                                    <X className="h-3.5 w-3.5" />
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
            <div className="p-4 border-t border-border bg-muted/20">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 font-medium"
                    onClick={handleSettingsClick}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Notification Settings
                </Button>
            </div>
        </div>
    );
}
