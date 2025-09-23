"use client";

import { useState } from "react";
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

    const todo = useQuery(api.todos.get, { id: todoId });
    const comments = useQuery(api.comments.getByTodo, { todoId });
    const createComment = useMutation(api.comments.create);

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
            toast.success("Comment added successfully");
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };


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

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days} days ago`;
    };

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent side="right" className="h-screen !w-full lg:!w-1/3 flex flex-col">
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
                        {comments && comments.length > 0 ? (
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
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
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
