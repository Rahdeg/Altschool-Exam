"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export function EmojiPickerComponent({ onEmojiSelect }: EmojiPickerProps) {
    const [showExtended, setShowExtended] = useState(false);

    const onEmojiClick = (emojiData: { emoji: string }) => {
        onEmojiSelect(emojiData.emoji);
        setShowExtended(false);
    };

    return (
        <Popover open={showExtended} onOpenChange={setShowExtended}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-gray-500 hover:bg-gray-100 rounded-full border border-gray-200"
                    title="Add reaction"
                >
                    <SmilePlus className="w-3 h-3" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={320}
                    height={400}
                    skinTonesDisabled={true}
                    searchDisabled={false}
                    previewConfig={{
                        showPreview: false
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
