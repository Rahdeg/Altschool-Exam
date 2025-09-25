"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Calendar, Clock, Send } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { CommentItem } from "./comment-item";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";
import { statusColor, priorityColor } from "@/lib/utils";

interface CommentSheetProps {
    todoId: Id<"todos">;
    isOpen: boolean;
    onClose: () => void;
}

export function CommentSheet({ todoId, isOpen, onClose }: CommentSheetProps) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedTodoId, setDebouncedTodoId] = useState<Id<"todos"> | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Add small debounce to prevent rapid queries
    useEffect(() => {
        if (isOpen && todoId) {
            const timer = setTimeout(() => {
                setDebouncedTodoId(todoId);
            }, 50); // Small delay to prevent rapid queries

            return () => clearTimeout(timer);
        } else {
            setDebouncedTodoId(null);
        }
    }, [isOpen, todoId]);

    // Only fetch data when sheet is open to prevent unnecessary API calls
    const todo = useQuery(api.todos.get, debouncedTodoId ? { id: debouncedTodoId } : "skip");
    const comments = useQuery(api.comments.getByTodoOptimized, debouncedTodoId ? { todoId: debouncedTodoId } : "skip");
    const createComment = useMutation(api.comments.create);

    // Auto-focus textarea when sheet opens and data is loaded
    useEffect(() => {
        if (isOpen && todo && comments !== undefined && textareaRef.current) {
            // Small delay to ensure the drawer animation completes and textarea is rendered
            const timer = setTimeout(() => {
                textareaRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [isOpen, todo, comments]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await createComment({
                body: newComment.trim(),
                todoId,
            });
            setNewComment("");
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (newComment.trim() && !isSubmitting) {
                handleSubmitComment(e as React.FormEvent<Element>);
            }
        }
    };


    // Show loading state when sheet is open but data is still loading
    if (isOpen && (!todo || comments === undefined)) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent side="right" className="h-screen !w-full lg:!w-1/3 flex flex-col">
                    <DrawerHeader className="flex-shrink-0 border-b border-border">
                        <DrawerTitle className="text-lg font-semibold text-card-foreground">
                            Loading...
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-sm text-muted-foreground">Loading comments...</p>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    if (!todo) return null;

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

        // Handle edge cases for newly created todos
        // If the difference is negative or very small (within 1 minute), treat as "Today"
        if (diff < 0 || diff < 60 * 1000) {
            return "Today";
        }

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent
                side="right"
                className="h-screen !w-full lg:!w-1/3 flex flex-col"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DrawerHeader className="flex-shrink-0 border-b border-border">
                    <DrawerTitle className="text-lg font-semibold text-card-foreground">
                        {todo.title}
                    </DrawerTitle>
                    <DrawerDescription className="text-sm text-muted-foreground my-2">
                        {todo.description}
                    </DrawerDescription>
                </DrawerHeader>

                {/* Task Info */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={statusColor[todo.status.toLowerCase()]}>
                            {todo.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className={priorityColor[todo.priority.toLowerCase()]}>
                            {todo.priority}
                        </Badge>
                        {todo.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={todo.user?.image} alt={todo.user?.name || "User"} />
                                <AvatarFallback className="text-xs">
                                    {todo.user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{todo.user?.name || "Unknown User"}</span>
                        </div>
                        {todo.dueDate && (
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{formatDate(todo.dueDate)}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{getTimeAgo(todo.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Comments Section - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                    <div className="space-y-4">
                        {comments === undefined ? (
                            // Skeleton loading state
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex gap-3 animate-pulse">
                                        <div className="h-8 w-8 bg-muted rounded-full flex-shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 bg-muted rounded w-24"></div>
                                                <div className="h-3 bg-muted rounded w-16"></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-4 bg-muted rounded w-full"></div>
                                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="h-3 bg-muted rounded w-12"></div>
                                                <div className="h-3 bg-muted rounded w-10"></div>
                                                <div className="h-3 bg-muted rounded w-12"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments && comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentItem key={comment._id} comment={comment} />
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add Comment Form - Fixed at bottom */}
                <div className="p-4 border-t border-border flex-shrink-0 bg-background">
                    <form onSubmit={handleSubmitComment} className="flex gap-2">
                        <Textarea
                            ref={textareaRef}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a comment... (Enter to send, Shift+Enter for new line)"
                            className="flex-1 min-h-[80px] max-h-[120px] resize-none"
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            size="sm"
                            className="self-end h-10"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
