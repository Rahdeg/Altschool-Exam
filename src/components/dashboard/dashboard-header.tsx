"use client";

import Image from "next/image";
import Link from "next/link";
import { UserDropdown } from "@/components/auth/user-dropdown";
import { NotificationBell } from "./notification-bell";

interface DashboardHeaderProps {
    onChatClick?: () => void;
}

export function DashboardHeader({ onChatClick }: DashboardHeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Image src="/todo.svg" alt="TaskyFlow" className="w-6 h-6" width={24} height={24} />
                            </div>
                            <span className="text-lg hidden md:block font-bold text-foreground">TaskyFlow</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notifications */}
                        <NotificationBell />

                        {/* User Menu */}
                        <UserDropdown onChatClick={onChatClick} />
                    </div>
                </div>
            </div>
        </header>
    );
}
