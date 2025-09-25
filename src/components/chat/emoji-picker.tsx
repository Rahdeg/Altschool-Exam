"use client";

import { useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onEmojiClick: (emoji: string) => void;
    disabled?: boolean;
}

export function EmojiPickerComponent({ onEmojiClick, disabled = false }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme();

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        onEmojiClick(emojiData.emoji);
        setIsOpen(false);
    };

    // Determine emoji picker theme based on current theme
    const getEmojiPickerTheme = (): Theme => {
        if (theme === "dark") return Theme.DARK;
        if (theme === "light") return Theme.LIGHT;
        return Theme.AUTO; // For system theme
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    className="h-9 w-9 rounded-full hover:bg-muted"
                >
                    <Smile className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 border-border shadow-lg"
                align="end"
                side="top"
            >
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    theme={getEmojiPickerTheme()}
                    previewConfig={{
                        showPreview: true,
                        defaultEmoji: "1f60a",
                        defaultCaption: "Choose an emoji"
                    }}
                    searchPlaceHolder="Search emojis..."
                    emojiStyle={EmojiStyle.NATIVE}
                />
            </PopoverContent>
        </Popover>
    );
}
