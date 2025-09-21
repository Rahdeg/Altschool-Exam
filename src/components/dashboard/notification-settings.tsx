"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Bell,
    MessageSquare,
    ThumbsUp,
    CheckCircle,
    Calendar,
    AtSign,
    Mail,
    Smartphone,
} from "lucide-react";

interface NotificationSettingsProps {
    onClose?: () => void;
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
    const [isLoading] = useState(false);

    const handlePreferenceChange = async () => {
        // Notification preferences will be added later
        toast.info("Notification preferences coming soon!");
    };

    const handleSaveAll = async () => {
        // Notification preferences will be added later
        toast.info("Notification preferences coming soon!");
        onClose?.();
    };

    // Simplified settings for now

    const notificationTypes = [
        {
            key: "taskComments" as const,
            label: "Task Comments",
            description: "When someone comments on your tasks",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        {
            key: "commentReplies" as const,
            label: "Comment Replies",
            description: "When someone replies to your comments",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        {
            key: "reactions" as const,
            label: "Reactions",
            description: "When someone reacts to your tasks or comments",
            icon: <ThumbsUp className="h-4 w-4" />,
        },
        {
            key: "taskStatusChanges" as const,
            label: "Task Status Changes",
            description: "When public task status is updated",
            icon: <CheckCircle className="h-4 w-4" />,
        },
        {
            key: "taskDueReminders" as const,
            label: "Due Date Reminders",
            description: "When tasks are approaching their due date",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            key: "directMessages" as const,
            label: "Direct Messages",
            description: "When you receive new messages",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        {
            key: "mentions" as const,
            label: "Mentions",
            description: "When you're mentioned in comments",
            icon: <AtSign className="h-4 w-4" />,
        },
    ];

    const deliveryMethods = [
        {
            key: "pushNotifications" as const,
            label: "Push Notifications",
            description: "Show notifications in your browser",
            icon: <Smartphone className="h-4 w-4" />,
        },
        {
            key: "emailNotifications" as const,
            label: "Email Notifications",
            description: "Send notifications via email",
            icon: <Mail className="h-4 w-4" />,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Notification Settings</h2>
            </div>

            {/* Notification Types */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">What to notify me about</CardTitle>
                    <CardDescription>
                        Choose which activities you want to be notified about
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {notificationTypes.map((type) => (
                        <div key={type.key} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 text-muted-foreground mt-0.5">
                                {type.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={type.key}
                                        checked={true}
                                        onCheckedChange={() =>
                                            handlePreferenceChange()
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor={type.key}
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        {type.label}
                                    </Label>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {type.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Delivery Methods */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">How to notify me</CardTitle>
                    <CardDescription>
                        Choose how you want to receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {deliveryMethods.map((method) => (
                        <div key={method.key} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 text-muted-foreground mt-0.5">
                                {method.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={method.key}
                                        checked={method.key === "pushNotifications"}
                                        onCheckedChange={() =>
                                            handlePreferenceChange()
                                        }
                                        disabled={isLoading}
                                    />
                                    <Label
                                        htmlFor={method.key}
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        {method.label}
                                    </Label>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSaveAll} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
