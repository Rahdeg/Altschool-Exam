"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SmilePlus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export function EmojiPickerComponent({ onEmojiSelect }: EmojiPickerProps) {
    const [showExtended, setShowExtended] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before accessing theme
    useEffect(() => {
        setMounted(true);
    }, []);

    const onEmojiClick = (emojiData: { emoji: string }) => {
        onEmojiSelect(emojiData.emoji);
        setShowExtended(false);
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
