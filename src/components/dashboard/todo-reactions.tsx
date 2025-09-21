"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ReactionButton } from "./reaction-button";
import { EmojiPickerComponent } from "./emoji-picker";

interface TodoReactionsProps {
    todoId: Id<"todos">;
    onReactionToggle: (emoji: string) => void;
}

export function TodoReactions({ todoId, onReactionToggle }: TodoReactionsProps) {
    const reactions = useQuery(api.reactions.getByTodo, { todoId });

    if (!reactions) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {/* Existing Reactions */}
            <div className="flex items-center gap-1 flex-wrap">
                {reactions.map((reaction) => (
                    <ReactionButton
                        key={reaction.emoji}
                        emoji={reaction.emoji}
                        count={reaction.count}
                        users={reaction.users.map(user => ({
                            _id: user.user._id,
                            name: user.user.name,
                            email: user.user.email,
                            image: user.user.image,
                        }))}
                        onToggle={() => onReactionToggle(reaction.emoji)}
                    />
                ))}
            </div>

            {/* Add Reaction Button */}
            <div className="flex items-center">
                <EmojiPickerComponent onEmojiSelect={onReactionToggle} />
            </div>
        </div>
    );
}
