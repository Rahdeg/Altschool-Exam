"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    MessageSquare,
    Calendar,
    Clock,
    MessageCircle
} from "lucide-react";
import { statusColor, priorityColor } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { CommentSheet } from "./comment-sheet";
import { TodoReactions } from "./todo-reactions";
import { TodoActions } from "./todo-actions";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";

type Todo = Doc<"todos"> & {
    user: {
        _id: Id<"users"> | undefined;
        name: string | undefined;
        email: string | undefined;
        image: string | undefined;
    };
    commentCount?: number;
    reactionCount?: number;
};

interface TodoListProps {
    filter: "all" | "my" | "public";
}

export function TodoList({ filter }: TodoListProps) {
    const [selectedTodoId, setSelectedTodoId] = useState<Id<"todos"> | null>(null);
    const router = useRouter();
    const currentUser = useCurrentUser();
    const createOrGetConversation = useMutation(api.chats.createOrGetConversation);

    const myTodos = useQuery(api.todos.getMyTodos, {});
    const publicTodos = useQuery(api.todos.getPublicTodos, {});
    const toggleReaction = useMutation(api.reactions.toggle);

    const handleReactionToggle = async (todoId: Id<"todos">, emoji: string) => {
        try {
            await toggleReaction({
                emoji,
                todoId,
            });
        } catch (error) {
            console.error("Failed to toggle reaction:", error);
        }
    };

    const handleChatClick = async (todo: Todo) => {
        if (!currentUser) {
            toast.error("You must be logged in to send messages");
            return;
        }

        // Don't allow messaging yourself
        if (currentUser._id === todo.userId) {
            toast.info("You can't message yourself about your own todo");
            return;
        }

        if (!todo.userId) {
            toast.error("Cannot start chat - user not found");
            return;
        }

        try {
            toast.loading("Creating conversation...");

            // Create or get existing conversation with the todo owner
            const conversationId = await createOrGetConversation({
                otherUserId: todo.userId,
            });

            // Navigate to the chat page
            router.push(`/chat/${conversationId}`);

            toast.dismiss(); // Remove loading toast
            toast.success("Starting chat...");

        } catch (error) {
            console.error("Failed to create conversation:", error);
            toast.dismiss(); // Remove loading toast
            toast.error("Failed to create conversation. Please try again.");
        }
    };

    const filteredTodos = (() => {
        if (filter === "my") return myTodos || [];
        if (filter === "public") return publicTodos || [];

        // Combine and deduplicate tasks for "all" view
        const myTodosList = myTodos || [];
        const publicTodosList = publicTodos || [];

        // Create a Set of task IDs to track duplicates
        const seenIds = new Set<string>();
        const allTodos: Todo[] = [];

        // Add all user's tasks first
        for (const todo of myTodosList) {
            if (!seenIds.has(todo._id) && todo.user._id) {
                seenIds.add(todo._id);
                allTodos.push(todo as Todo);
            }
        }

        // Add public tasks that aren't already included
        for (const todo of publicTodosList) {
            if (!seenIds.has(todo._id) && todo.user._id) {
                seenIds.add(todo._id);
                allTodos.push(todo as Todo);
            }
        }

        return allTodos;
    })();

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const getTimeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    if (myTodos === undefined || publicTodos === undefined) {
        return (
            <div className="space-y-6">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                    <div className="px-4 py-2 rounded-md text-sm font-medium bg-muted-foreground/10 animate-pulse">
                        Loading...
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-3">
                                <div className="h-4 bg-muted-foreground/10 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted-foreground/10 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="h-3 bg-muted-foreground/10 rounded w-full mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-muted-foreground/10 rounded w-1/4"></div>
                                    <div className="h-3 bg-muted-foreground/10 rounded w-1/4"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Handle authentication errors
    if (myTodos === null || publicTodos === null) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Authentication Required</h3>
                    <p className="text-muted-foreground">
                        Please sign in to view your tasks.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Todo Cards */}
            {filteredTodos.map((todo) => (
                <Card key={todo._id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CardTitle className="text-lg">{todo.title}</CardTitle>
                                    {!todo.isPublic && (
                                        <Badge variant="outline" className="text-xs">
                                            Private
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {todo.description}
                                </CardDescription>
                            </div>
                            <TodoActions todo={todo} />
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <Badge
                                className={statusColor[todo.status.toLowerCase()]}
                            >
                                {todo.status.replace("_", " ")}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={priorityColor[todo.priority.toLowerCase()]}
                            >
                                {todo.priority}
                            </Badge>
                            {todo.tags?.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {/* User info and metadata */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <div className="flex items-center space-x-1">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={todo.user.image} alt={todo.user.name || "User"} />
                                            <AvatarFallback className="text-xs">
                                                {todo.user.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{todo.user.name || "Unknown User"}</span>
                                    </div>

                                    {todo.dueDate && (
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(todo.dueDate)}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{getTimeAgo(todo.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reactions and Comments Section */}
                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <TodoReactions
                                    todoId={todo._id}
                                    onReactionToggle={(emoji) => handleReactionToggle(todo._id, emoji)}
                                />
                                <div className="flex items-center space-x-2">
                                    {/* Chat Button - only show if not the current user's todo */}
                                    {currentUser && currentUser._id !== todo.userId && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                            onClick={() => handleChatClick(todo)}
                                            title={`Chat with ${todo.user.name}`}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {/* Comment Button */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                        onClick={() => setSelectedTodoId(todo._id)}
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="ml-1">{todo.commentCount || 0}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {filteredTodos.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
                    <p className="text-muted-foreground">
                        {filter === "my"
                            ? "You haven't created any tasks yet."
                            : filter === "public"
                                ? "No public tasks available."
                                : "No tasks match your current filter."
                        }
                    </p>
                </div>
            )}

            {/* Comment Sheet */}
            {selectedTodoId && (
                <CommentSheet
                    todoId={selectedTodoId}
                    isOpen={!!selectedTodoId}
                    onClose={() => setSelectedTodoId(null)}
                />
            )}
        </div>
    );
}
