"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Plus,
    Search,
    MoreVertical,
    Circle
} from "lucide-react";

// Mock data - in real app this would come from Convex
const mockConversations = [
    {
        _id: "conv1",
        otherUser: {
            _id: "user2",
            name: "Jane Smith",
            email: "jane@example.com",
            image: "/placeholder-avatar.jpg"
        },
        latestMessage: {
            body: "Hey, how's the project going?",
            createdAt: Date.now() - 1000 * 60 * 30, // 30 minutes ago
            senderId: "user2"
        },
        unreadCount: 2,
        status: "online"
    },
    {
        _id: "conv2",
        otherUser: {
            _id: "user3",
            name: "Mike Johnson",
            email: "mike@example.com",
            image: "/placeholder-avatar.jpg"
        },
        latestMessage: {
            body: "Thanks for the feedback on the design!",
            createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
            senderId: "user1"
        },
        unreadCount: 0,
        status: "away"
    },
    {
        _id: "conv3",
        otherUser: {
            _id: "user4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            image: "/placeholder-avatar.jpg"
        },
        latestMessage: {
            body: "Can we schedule a meeting for tomorrow?",
            createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            senderId: "user4"
        },
        unreadCount: 1,
        status: "offline"
    }
];

export function ChatSidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "online": return "bg-green-500";
            case "away": return "bg-yellow-500";
            case "offline": return "bg-gray-400";
            default: return "bg-gray-400";
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Messages</h2>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2 space-y-1">
                    {mockConversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedConversation === conversation._id ? "bg-blue-50 border border-blue-200" : ""
                                }`}
                            onClick={() => setSelectedConversation(conversation._id)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={conversation.otherUser.image} alt={conversation.otherUser.name} />
                                        <AvatarFallback>
                                            {conversation.otherUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {conversation.otherUser.name}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {conversation.unreadCount > 0 && (
                                                <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                                    {conversation.unreadCount}
                                                </Badge>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {formatTime(conversation.latestMessage.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 truncate">
                                        {conversation.latestMessage.senderId === "user1" ? "You: " : ""}
                                        {conversation.latestMessage.body}
                                    </p>
                                </div>

                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedConversation && (
                <div className="border-t h-96 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={mockConversations.find(c => c._id === selectedConversation)?.otherUser.image} alt="User" />
                                    <AvatarFallback>
                                        {mockConversations.find(c => c._id === selectedConversation)?.otherUser.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(mockConversations.find(c => c._id === selectedConversation)?.status || "offline")}`} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium">
                                    {mockConversations.find(c => c._id === selectedConversation)?.otherUser.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {mockConversations.find(c => c._id === selectedConversation)?.status}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-3">
                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs">
                                    <p className="text-sm">Hey, how's the project going?</p>
                                    <p className="text-xs opacity-75 mt-1">2:30 PM</p>
                                </div>
                            </div>

                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                                    <p className="text-sm">It's going well! Just finished the design mockups.</p>
                                    <p className="text-xs text-gray-500 mt-1">2:32 PM</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs">
                                    <p className="text-sm">Great! Can you share them?</p>
                                    <p className="text-xs opacity-75 mt-1">2:33 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button size="sm">
                                <MessageSquare className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
