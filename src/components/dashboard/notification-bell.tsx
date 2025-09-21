"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NotificationPanel } from "./notification-panel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

    const unreadCount = useQuery(api.notifications.getUnreadCount);
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);

    // Show toast when new notifications arrive
    useEffect(() => {
        if (unreadCount !== undefined && previousUnreadCount !== undefined) {
            const newNotifications = unreadCount - previousUnreadCount;
            if (newNotifications > 0) {
                toast.success(`${newNotifications} new notification${newNotifications > 1 ? 's' : ''}`, {
                    description: "Click the bell icon to view",
                });
            }
        }
        setPreviousUnreadCount(unreadCount || 0);
    }, [unreadCount, previousUnreadCount]);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount !== undefined && unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 max-h-[500px] overflow-hidden"
                sideOffset={8}
            >
                <NotificationPanel
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClose={() => setIsOpen(false)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
