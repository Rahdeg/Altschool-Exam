"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NotificationBell } from "./notification-bell";

interface DashboardHeaderProps {
    onChatClick?: () => void;
}

export function DashboardHeader({ onChatClick }: DashboardHeaderProps) {
    const currentUser = useQuery(api.users.getCurrentUser);
    const { signOut } = useAuthActions();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
            <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Image src="/todo.svg" alt="TaskyFlow" className="w-6 h-6" width={24} height={24} />
                            </div>
                            <span className="text-lg sm:text-xl font-bold text-gray-900">TaskyFlow</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Mobile Chat Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onChatClick}
                        >
                            <MessageSquare className="w-5 h-5" />
                        </Button>

                        {/* Notifications */}
                        <NotificationBell />

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser?.image} alt={currentUser?.name || "User"} />
                                        <AvatarFallback>
                                            {currentUser?.name?.charAt(0) || <User className="w-4 h-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{currentUser?.name || "User"}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {currentUser?.email || "user@example.com"}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}
