"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export function EmojiPickerComponent({ onEmojiSelect }: EmojiPickerProps) {
    const [showExtended, setShowExtended] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    // Ensure component is mounted before accessing theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const onEmojiClick = (emojiData: { emoji: string }) => {
        onEmojiSelect(emojiData.emoji);
        setShowExtended(false);
    };

    // Determine emoji picker theme based on current theme
    const getEmojiPickerTheme = (): Theme => {
        if (theme === "dark") return Theme.DARK;
        if (theme === "light") return Theme.LIGHT;
        return Theme.AUTO; // For system theme
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground rounded-full border border-border"
                title="Add reaction"
            >
                <SmilePlus className="w-3 h-3" />
            </Button>
        );
    }


    return (
        <Popover open={showExtended} onOpenChange={setShowExtended}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground rounded-full border border-border"
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
                    skinTonesDisabled={false}
                    searchDisabled={false}
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
