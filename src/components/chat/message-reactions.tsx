"use client";

import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { EmojiPickerComponent } from "./emoji-picker";

interface MessageReactionsProps {
    messageId: Id<"messages">;
    conversationId: Id<"conversations">;
}


export function MessageReactions({ messageId }: MessageReactionsProps) {
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


    return (
        <div className="flex items-center space-x-1 mt-1">
            {/* Emoji Picker */}
            <EmojiPickerComponent
                onEmojiClick={handleReactionClick}
                disabled={!currentUser}
            />

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
