"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { Smile } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface MessageReactionsProps {
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
}

const QUICK_REACTIONS = [
    { emoji: "👍", label: "Thumbs Up" },
    { emoji: "❤️", label: "Heart" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "😮", label: "Wow" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
];

export function MessageReactions({ messageId }: MessageReactionsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentUser = useCurrentUser();

    const reactions = useQuery(api.reactions.getReactions, { messageId });
    const addReaction = useMutation(api.reactions.addReaction);
    const removeReaction = useMutation(api.reactions.removeReaction);

    const handleReactionClick = async (emoji: string) => {
        if (!currentUser) return;

        try {
            // Check if user already reacted with this emoji
            const existingReaction = reactions?.find(
                reaction => reaction.userId === currentUser._id && reaction.emoji === emoji
            );

            if (existingReaction) {
                // Remove existing reaction
                await removeReaction({ reactionId: existingReaction._id });
                toast.success("Reaction removed");
            } else {
                // Add new reaction
                await addReaction({
                    emoji,
                    messageId,
                    userId: currentUser._id,
                });
                toast.success("Reaction added");
            }
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
            toast.error("Failed to toggle reaction");
        }
    };

    // Group reactions by emoji
    const groupedReactions = reactions?.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
    }, {} as Record<string, typeof reactions>) || {};

    const hasUserReacted = (emoji: string) => {
        return reactions?.some(
            reaction => reaction.userId === currentUser?._id && reaction.emoji === emoji
        ) || false;
    };

    return (
        <div className="flex items-center space-x-1 mt-1">
            {/* Quick Reactions */}
            <div className="flex items-center space-x-1">
                {QUICK_REACTIONS.map(({ emoji, label }) => (
                    <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReactionClick(emoji)}
                        className={`h-6 px-2 text-xs rounded-full transition-colors ${hasUserReacted(emoji)
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "hover:bg-muted"
                            }`}
                        title={label}
                    >
                        {emoji}
                    </Button>
                ))}
            </div>

            {/* More Reactions Button */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs rounded-full hover:bg-muted"
                    >
                        <Smile className="w-3 h-3" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                    <div className="grid grid-cols-6 gap-1">
                        {QUICK_REACTIONS.map(({ emoji, label }) => (
                            <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    handleReactionClick(emoji);
                                    setIsOpen(false);
                                }}
                                className={`h-8 w-8 p-0 text-lg rounded-full transition-colors ${hasUserReacted(emoji)
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-muted"
                                    }`}
                                title={label}
                            >
                                {emoji}
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Reaction Counts */}
            {Object.keys(groupedReactions).length > 0 && (
                <div className="flex items-center space-x-1 ml-2">
                    {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
                        <Badge
                            key={emoji}
                            variant="secondary"
                            className="h-5 px-2 text-xs rounded-full cursor-pointer hover:bg-muted/50"
                            onClick={() => handleReactionClick(emoji)}
                        >
                            {emoji} {reactionList?.length || 0}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
