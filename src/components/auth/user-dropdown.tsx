"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, Settings, ChevronDown, Building2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/theme-toggle";

interface UserDropdownProps {
    onChatClick?: () => void;
}

export function UserDropdown({ onChatClick }: UserDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { signOut } = useAuthActions();
    const currentUser = useCurrentUser();
    const router = useRouter();

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await signOut();
            router.push("/");
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToDashboard = () => {
        router.push("/dashboard");
    };

    const handleMessagesClick = () => {
        if (onChatClick) {
            onChatClick();
        }
    };

    const handleAccountSettingsClick = () => {
        router.push("/settings");
    };

    if (!currentUser) {
        return null;
    }

    const userInitials = currentUser.name
        ? currentUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : currentUser.email?.[0]?.toUpperCase() || "U";

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 px-3 py-2 h-auto rounded-lg transition-colors"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.image} alt={currentUser.name || currentUser.email} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-foreground">
                            {currentUser.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {currentUser.email}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-50" side="bottom" alignOffset={-5} sideOffset={5}>
                {/* Navigation Items */}
                <DropdownMenuItem onClick={handleGoToDashboard} className="cursor-pointer">
                    <Building2 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>
                {onChatClick && (
                    <DropdownMenuItem onClick={handleMessagesClick} className="cursor-pointer lg:hidden">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Messages</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleAccountSettingsClick} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Theme Toggle Section - Full Width */}
                <div className="px-3 py-2">
                    <ModeToggle />
                </div>
                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    disabled={isLoading}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoading ? "Signing out..." : "Logout"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
