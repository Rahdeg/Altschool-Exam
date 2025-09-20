"use client";

import { useState } from "react";
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
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserButton() {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={currentUser.image} alt={currentUser.name || currentUser.email} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">
                            {currentUser.name || "User"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {currentUser.email}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {currentUser.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {currentUser.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGoToDashboard} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    disabled={isLoading}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
