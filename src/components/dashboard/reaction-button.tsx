"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ReactionButtonProps {
    emoji: string;
    count: number;
    users: Array<{
        _id: string | undefined;
        name: string | undefined;
        email: string | undefined;
        image: string | undefined;
    }>;
    onToggle: () => void;
}

export function ReactionButton({ emoji, count, users, onToggle }: ReactionButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-2 gap-1 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors ${isHovered ? 'bg-gray-50 border-gray-300' : 'bg-white'
                        }`}
                    onClick={onToggle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <span className="text-xs">{emoji}</span>
                    <span className="text-xs text-gray-600 font-medium">{count}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-700">
                        {count} {count === 1 ? 'reaction' : 'reactions'}
                    </div>
                    <div className="space-y-2">
                        {users.map((user, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.image} alt={user.name || "User"} />
                                    <AvatarFallback className="text-xs">
                                        {user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-700">
                                    {user.name || "Unknown User"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
