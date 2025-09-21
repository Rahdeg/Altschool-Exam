"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface UserSelectionProps {
    isOpen: boolean;
    onClose: () => void;
    onUserSelected: (userId: Id<"users">) => void;
}

export function UserSelection({ isOpen, onClose, onUserSelected }: UserSelectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const users = useQuery(api.users.getAllUsers);
    const createConversation = useMutation(api.chats.createOrGetConversation);

    const filteredUsers = users?.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleUserSelect = async (userId: Id<"users">) => {
        if (isCreating) return;

        setIsCreating(true);
        try {
            await createConversation({ otherUserId: userId });
            onUserSelected(userId);
            onClose();
            toast.success("Conversation started!");
        } catch (error) {
            console.error("Failed to create conversation:", error);
            toast.error("Failed to start conversation");
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Start New Conversation</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>

                <div className="p-6">
                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-blue-300 transition-all"
                        />
                    </div>

                    {/* Users List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
                                    onClick={() => handleUserSelect(user._id)}
                                >
                                    <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                                        <AvatarImage src={user.image} alt={user.name || "User"} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                                            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {user.name || "Unknown User"}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        disabled={isCreating}
                                        className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUserSelect(user._id);
                                        }}
                                    >
                                        {isCreating ? "Starting..." : "Chat"}
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">
                                    {searchQuery ? "No users found" : "No users available"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {searchQuery ? "Try adjusting your search" : "No other users in the system"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
