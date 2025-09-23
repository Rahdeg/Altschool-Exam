"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserSelection } from "./user-selection";
import { useRouter } from "next/navigation";
import {
    MessageSquare,
    Plus,
    Search,
    MoreVertical
} from "lucide-react";

export function ChatSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserSelection, setShowUserSelection] = useState(false);
    const router = useRouter();

    const currentUser = useCurrentUser();
    const conversations = useQuery(api.chats.getConversations);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;

        // For older messages, show the date
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
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

    const filteredConversations = conversations?.filter(conv =>
        conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.otherUser?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.latestMessage?.body?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleUserSelected = (userId: Id<"users">) => {
        // Find the conversation with this user
        const conversation = conversations?.find(conv =>
            conv.otherUser?._id === userId
        );
        if (conversation) {
            router.push(`/chat/${conversation._id}`);
        }
    };

    const handleConversationClick = (conversationId: Id<"conversations">) => {
        router.push(`/chat/${conversationId}`);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="p-4 border-b border-border bg-background">
                <div className="flex items-center justify-between my-4">
                    <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-full transition-colors hover:bg-muted"
                        onClick={() => setShowUserSelection(true)}
                    >
                        <Plus className="w-5 h-5 text-foreground" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-muted border-border rounded-xl transition-all"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto bg-background">
                <div className="p-3 space-y-2">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation._id}
                                className="group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-muted/50 border border-transparent hover:border-border bg-muted/30"
                                onClick={() => handleConversationClick(conversation._id)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                                            <AvatarImage src={conversation.otherUser?.image} alt={conversation.otherUser?.name || "User"} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                                {conversation.otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${getStatusColor("online")} shadow-sm`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-foreground truncate">
                                                {conversation.otherUser?.name || "Unknown User"}
                                            </h3>
                                            <div className="flex items-center space-x-2 ml-2">
                                                {conversation.unreadCount > 0 && (
                                                    <Badge
                                                        className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-semibold bg-red-500 text-white shadow-sm"
                                                    >
                                                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground truncate leading-relaxed flex-1">
                                                {conversation.latestMessage ? (
                                                    <>
                                                        {conversation.latestMessage.senderId === currentUser?._id ? (
                                                            <span className="text-muted-foreground/70">You: </span>
                                                        ) : ""}
                                                        {conversation.latestMessage.body}
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground/60 italic">No messages yet</span>
                                                )}
                                            </p>
                                            {conversation.latestMessage && (
                                                <span className="text-xs text-muted-foreground/60 ml-2 flex-shrink-0">
                                                    {formatTime(conversation.latestMessage.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                    >
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <MessageSquare className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                {searchQuery ? "No conversations found" : "No conversations yet"}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                                {searchQuery ? "Try adjusting your search" : "Start a new chat to get started"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* User Selection Modal */}
            <UserSelection
                isOpen={showUserSelection}
                onClose={() => setShowUserSelection(false)}
                onUserSelected={handleUserSelected}
            />
        </div>
    );
}
