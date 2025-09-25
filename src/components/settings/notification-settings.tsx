"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Bell, MessageSquare, ThumbsUp, CheckCircle, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
    const notificationPreferences = useQuery(api.users.getNotificationPreferences);
    const updateNotificationPreferences = useMutation(api.users.updateNotificationPreferences);
    const initializeNotificationPreferences = useMutation(api.users.initializeNotificationPreferences);

    const [isUpdating, setIsUpdating] = useState(false);
    const [preferences, setPreferences] = useState({
        taskComments: true,
        commentReplies: true,
        reactions: true,
        taskStatusChanges: true,
        taskDueReminders: true,
        directMessages: true,
    });

    // Initialize preferences when data loads
    useEffect(() => {
        if (notificationPreferences) {
            setPreferences({
                taskComments: notificationPreferences.taskComments,
                commentReplies: notificationPreferences.commentReplies,
                reactions: notificationPreferences.reactions,
                taskStatusChanges: notificationPreferences.taskStatusChanges,
                taskDueReminders: notificationPreferences.taskDueReminders,
                directMessages: notificationPreferences.directMessages,
            });
        } else if (notificationPreferences === null) {
            // Initialize default preferences if they don't exist
            initializeNotificationPreferences();
        }
    }, [notificationPreferences, initializeNotificationPreferences]);

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setIsUpdating(true);
        try {
            await updateNotificationPreferences(preferences);
            toast.success("Notification preferences updated");
        } catch (error) {
            console.error("Error updating preferences:", error);
            toast.error("Failed to update preferences");
        } finally {
            setIsUpdating(false);
        }
    };

    const notificationItems = [
        {
            key: "taskComments" as const,
            icon: <MessageSquare className="w-5 h-5" />,
            label: "Task Comments",
            description: "When someone comments on your tasks"
        },
        {
            key: "commentReplies" as const,
            icon: <MessageSquare className="w-5 h-5" />,
            label: "Comment Replies",
            description: "When someone replies to your comments"
        },
        {
            key: "reactions" as const,
            icon: <ThumbsUp className="w-5 h-5" />,
            label: "Reactions",
            description: "When someone reacts to your tasks or comments"
        },
        {
            key: "taskStatusChanges" as const,
            icon: <CheckCircle className="w-5 h-5" />,
            label: "Task Status Changes",
            description: "When public task status is updated"
        },
        {
            key: "taskDueReminders" as const,
            icon: <Calendar className="w-5 h-5" />,
            label: "Due Date Reminders",
            description: "When tasks are approaching their due date"
        },
        {
            key: "directMessages" as const,
            icon: <Mail className="w-5 h-5" />,
            label: "Direct Messages",
            description: "When you receive new messages"
        }
    ];

    return (
        <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
            </div>

            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-medium text-foreground">What to notify me about</h3>
                <p className="text-sm text-muted-foreground">Choose which activities you want to be notified about</p>
            </div>

            <div className="space-y-4">
                {notificationItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="text-muted-foreground">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <Label htmlFor={item.key} className="text-sm font-medium text-foreground cursor-pointer">
                                    {item.label}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                        <Checkbox
                            id={item.key}
                            checked={preferences[item.key]}
                            onCheckedChange={() => handlePreferenceChange(item.key)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t">
                <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                >
                    {isUpdating ? "Saving..." : "Save Preferences"}
                </Button>
            </div>
        </div>
    );
}
