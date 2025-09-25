"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmojiPickerComponent } from "./emoji-picker";
import { MessageReactions } from "./message-reactions";
import {
    ArrowLeft,
    Send,
    MoreVertical,
    Star,
    Trash2,
    Copy,
    CheckCheck
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IndividualChatProps {
    conversationId: string;
}

export function IndividualChat({ conversationId }: IndividualChatProps) {
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();
    const currentUser = useCurrentUser();
    const conversation = useQuery(api.chats.getConversations);
    const messages = useQuery(api.chats.getMessages, { conversationId: conversationId as Id<"conversations"> });
    const typingIndicators = useQuery(api.users.getTypingIndicators, { conversationId: conversationId as Id<"conversations"> });

    const sendMessage = useMutation(api.chats.sendMessage);
    const markAsRead = useMutation(api.chats.markAsRead);
    const updateTyping = useMutation(api.users.updateTyping);
    const toggleMessageStar = useMutation(api.chats.toggleMessageStar);
    const clearConversation = useMutation(api.chats.clearConversation);

    // Find the current conversation details
    const currentConversation = conversation?.find(conv => conv._id === conversationId);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Mark messages as read when conversation is opened
    useEffect(() => {
        if (messages && currentUser) {
            const unreadMessageIds = messages
                .filter(msg => msg.senderId !== currentUser._id && !msg.deletedAt)
                .map(msg => msg._id);

            if (unreadMessageIds.length > 0) {
                markAsRead({ messageIds: unreadMessageIds });
            }
        }
    }, [messages, currentUser, markAsRead]);

    // Auto-focus textarea when component mounts
    useEffect(() => {
        if (textareaRef.current) {
            // Small delay to ensure the component is fully rendered
            const timer = setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage({
                conversationId: conversationId as Id<"conversations">,
                body: newMessage.trim(),
                type: "text",
            });
            setNewMessage("");

            // Stop typing indicator
            await updateTyping({ conversationId: conversationId as Id<"conversations">, isTyping: false });
            setIsTyping(false);
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = (value: string) => {
        setNewMessage(value);

        // Update typing indicator
        const isCurrentlyTyping = value.trim().length > 0;

        if (isCurrentlyTyping && !isTyping) {
            setIsTyping(true);
            updateTyping({ conversationId: conversationId as Id<"conversations">, isTyping: true });
        } else if (!isCurrentlyTyping && isTyping) {
            setIsTyping(false);
            updateTyping({ conversationId: conversationId as Id<"conversations">, isTyping: false });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(async () => {
            if (isTyping) {
                setIsTyping(false);
                await updateTyping({ conversationId: conversationId as Id<"conversations">, isTyping: false });
            }
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (newMessage.trim() && !isSending) {
                handleSendMessage(e as React.FormEvent<Element>);
            }
        }
    };


    const handleEmojiClick = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
    };

    const handleMessageAction = async (action: string, messageId: Id<"messages">) => {
        try {
            switch (action) {
                case "copy":
                    navigator.clipboard.writeText(messages?.find(m => m._id === messageId)?.body || "");
                    toast.success("Message copied to clipboard");
                    break;
                case "star":
                    await toggleMessageStar({ messageId });
                    const message = messages?.find(m => m._id === messageId);
                    toast.success(message?.isStarred ? "Message unstarred" : "Message starred");
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Failed to perform action:", error);
            toast.error("Failed to perform action");
        }
    };

    const handleClearChat = async () => {
        if (!confirm("Are you sure you want to clear this chat? This action cannot be undone.")) {
            return;
        }

        try {
            await clearConversation({ conversationId: conversationId as Id<"conversations"> });
            toast.success("Chat cleared successfully");
        } catch (error) {
            console.error("Failed to clear chat:", error);
            toast.error("Failed to clear chat");
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp: number) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

        // Handle edge cases for newly created messages
        // If the difference is negative or very small (within 1 minute), treat as "Today"
        const diffInMs = now.getTime() - messageDate.getTime();
        if (diffInMs < 0 || diffInMs < 60 * 1000) {
            return "Today";
        }

        if (diffInDays === 0) {
            return "Today";
        } else if (diffInDays === 1) {
            return "Yesterday";
        } else if (diffInDays < 7) {
            return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
        } else {
            return messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: now.getFullYear() !== messageDate.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "away": return "bg-yellow-500";
            case "offline": return "bg-gray-400";
            default: return "bg-gray-400";
        }
    };

    const getMessageStatus = (message: { senderId: string }) => {
        if (message.senderId !== currentUser?._id) return null;

        // This would need to be implemented based on your read receipts logic
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
    };

    if (!currentConversation || !currentUser) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading conversation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm">
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                            <AvatarImage src={currentConversation.otherUser?.image} alt={currentConversation.otherUser?.name || "User"} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                {currentConversation.otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor("online")} shadow-sm`} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate">
                            {currentConversation.otherUser?.name || "Unknown User"}
                        </h3>
                        <p className="text-sm text-green-600 font-medium">
                            Online
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600" onClick={handleClearChat}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear chat
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-muted/30 p-4 space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => {
                        const isOwnMessage = message.senderId === currentUser._id;
                        const showAvatar = !isOwnMessage;
                        const prevMessage = index > 0 ? messages[index - 1] : null;
                        const showDate = !prevMessage ||
                            Math.floor((message.createdAt - prevMessage.createdAt) / (1000 * 60 * 60 * 24)) > 0;

                        return (
                            <div key={message._id}>
                                {showDate && (
                                    <div className="flex justify-center my-4">
                                        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                                            {formatDate(message.createdAt)}
                                        </div>
                                    </div>
                                )}

                                <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} space-x-3 group`}>
                                    {showAvatar && (
                                        <Avatar className="h-8 w-8 mt-1 ring-2 ring-background shadow-sm">
                                            <AvatarImage src={message.sender?.image} alt={message.sender?.name || "User"} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-xs">
                                                {message.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className={`max-w-xs lg:max-w-md ${showAvatar ? "ml-0" : "mr-0"}`}>
                                        <div className="relative">
                                            <div
                                                className={`rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-card text-card-foreground border border-border"
                                                    } ${message.isStarred ? "ring-2 ring-yellow-400/50" : ""}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <p className="text-sm leading-relaxed flex-1">{message.body}</p>
                                                    {message.isStarred && (
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 ml-2 mt-0.5 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Message Actions */}
                                            <div className={`absolute ${isOwnMessage ? "-left-12" : "-right-12"} top-0 opacity-0 group-hover:opacity-100 transition-opacity`}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                                                        <DropdownMenuItem onClick={() => handleMessageAction("star", message._id)}>
                                                            <Star className={`w-4 h-4 mr-2 ${message.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                                            {message.isStarred ? "Unstar" : "Star"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleMessageAction("copy", message._id)}>
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copy
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        <div className={`flex items-center space-x-1 mt-1 px-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(message.createdAt)}
                                            </span>
                                            {getMessageStatus(message)}
                                        </div>

                                        {/* Message Reactions */}
                                        <MessageReactions
                                            messageId={message._id}
                                            conversationId={conversationId as Id<"conversations">}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <Send className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">No messages yet</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">Start the conversation!</p>
                    </div>
                )}

                {/* Typing Indicators */}
                {typingIndicators && typingIndicators.length > 0 && (
                    <div className="flex justify-start space-x-3">
                        <Avatar className="h-8 w-8 mt-1 ring-2 ring-background shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-xs">
                                {typingIndicators[0].user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-card text-muted-foreground rounded-2xl px-4 py-3 shadow-sm border border-border">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
                                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>


            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={newMessage}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                            className="min-h-[44px] max-h-32 bg-muted border-border rounded-2xl pr-12 transition-all resize-none"
                            disabled={isSending}
                        />
                        <div className="absolute right-1 top-1">
                            <EmojiPickerComponent
                                onEmojiClick={handleEmojiClick}
                                disabled={isSending}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="h-11 w-11 rounded-full shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
