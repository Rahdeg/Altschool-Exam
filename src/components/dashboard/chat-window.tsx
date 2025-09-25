"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, ArrowLeft, MessageSquare } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

interface ChatWindowProps {
    conversationId: Id<"conversations">;
    onBack: () => void;
}

export function ChatWindow({ conversationId, onBack }: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const currentUser = useCurrentUser();
    const conversation = useQuery(api.chats.getConversations);
    const messages = useQuery(api.chats.getMessages, { conversationId });
    const typingIndicators = useQuery(api.users.getTypingIndicators, { conversationId });

    const sendMessage = useMutation(api.chats.sendMessage);
    const markAsRead = useMutation(api.chats.markAsRead);
    const updateTyping = useMutation(api.users.updateTyping);

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
                .filter(msg => msg.senderId !== currentUser._id)
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
                conversationId,
                body: newMessage.trim(),
                type: "text",
            });
            setNewMessage("");

            // Stop typing indicator
            await updateTyping({ conversationId, isTyping: false });
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
            updateTyping({ conversationId, isTyping: true });
        } else if (!isCurrentlyTyping && isTyping) {
            setIsTyping(false);
            updateTyping({ conversationId, isTyping: false });
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(async () => {
            if (isTyping) {
                setIsTyping(false);
                await updateTyping({ conversationId, isTyping: false });
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

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "away": return "bg-yellow-500";
            case "offline": return "bg-gray-400";
            default: return "bg-gray-400";
        }
    };

    if (!currentConversation || !currentUser) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Loading conversation...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-card">
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-card flex items-center space-x-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="lg:hidden rounded-full"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
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
                    <h3 className="text-sm font-semibold text-card-foreground truncate">
                        {currentConversation.otherUser?.name || "Unknown User"}
                    </h3>
                    <p className="text-xs text-green-600 font-medium">
                        Online
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/30">
                {messages && messages.length > 0 ? (
                    messages.map((message) => {
                        const isOwnMessage = message.senderId === currentUser._id;
                        const showAvatar = !isOwnMessage;

                        return (
                            <div
                                key={message._id}
                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} space-x-3`}
                            >
                                {showAvatar && (
                                    <Avatar className="h-8 w-8 mt-1 ring-2 ring-background shadow-sm">
                                        <AvatarImage src={message.sender?.image} alt={message.sender?.name || "User"} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-xs">
                                            {message.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div className={`max-w-xs ${showAvatar ? "ml-0" : "mr-0"}`}>
                                    <div
                                        className={`rounded-2xl px-4 py-3 shadow-sm ${isOwnMessage
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-card text-card-foreground border border-border"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.body}</p>
                                    </div>
                                    <p className={`text-xs mt-1 px-1 ${isOwnMessage ? "text-right text-muted-foreground" : "text-left text-muted-foreground"
                                        }`}>
                                        {formatTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-muted-foreground" />
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
                    <Textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => handleTyping(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                        className="flex-1 min-h-[44px] max-h-32 bg-muted border-border rounded-2xl transition-all resize-none"
                        disabled={isSending}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                        className="h-11 w-11 rounded-full shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
