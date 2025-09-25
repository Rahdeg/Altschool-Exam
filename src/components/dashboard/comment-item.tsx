"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Reply, Edit, Trash2, Send, X, ChevronDown, ChevronRight } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface CommentItemProps {
    comment: {
        _id: Id<"comments">;
        body: string;
        todoId: Id<"todos">;
        userId: Id<"users">;
        createdAt: number;
        updatedAt: number;
        user: {
            _id: Id<"users"> | undefined;
            name: string | undefined;
            email: string | undefined;
            image: string | undefined;
        };
        replies?: CommentItemProps["comment"][];
    };
}

export const CommentItem = React.memo(function CommentItem({ comment }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [editText, setEditText] = useState(comment.body);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReplies, setShowReplies] = useState(true);

    const updateComment = useMutation(api.comments.update);
    const deleteComment = useMutation(api.comments.remove);
    const createReply = useMutation(api.comments.create);

    const handleEdit = async () => {
        if (!editText.trim()) return;

        setIsSubmitting(true);
        try {
            await updateComment({
                id: comment._id,
                body: editText.trim(),
            });
            setIsEditing(false);
            toast.success("Comment updated successfully");
        } catch (error) {
            console.error("Failed to update comment:", error);
            toast.error("Failed to update comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            await deleteComment({ id: comment._id });
            toast.success("Comment deleted successfully");
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Failed to delete comment");
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await createReply({
                body: replyText.trim(),
                todoId: comment.todoId,
                parentCommentId: comment._id,
            });
            setReplyText("");
            setIsReplying(false);
            toast.success("Reply added successfully");
        } catch (error) {
            console.error("Failed to add reply:", error);
            toast.error("Failed to add reply");
        } finally {
            setIsSubmitting(false);
        }
    };


    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-3">
            {/* Main Comment */}
            <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.user.image} alt={comment.user.name || "User"} />
                    <AvatarFallback className="text-xs">
                        {comment.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    {/* Comment Header */}
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user.name || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                        </span>
                        {comment.updatedAt !== comment.createdAt && (
                            <span className="text-xs text-muted-foreground/70">(edited)</span>
                        )}
                    </div>

                    {/* Comment Content */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <Textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="min-h-[80px] resize-none"
                                disabled={isSubmitting}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleEdit}
                                    disabled={!editText.trim() || isSubmitting}
                                >
                                    <Send className="w-3 h-3 mr-1" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditText(comment.body);
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-foreground whitespace-pre-wrap">
                            {comment.body}
                        </div>
                    )}

                    {/* Comment Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsReplying(!isReplying)}
                                className="h-auto p-1 text-xs"
                            >
                                <Reply className="w-3 h-3 mr-1" />
                                Reply
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="h-auto p-1 text-xs"
                            >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="h-auto p-1 text-xs text-destructive hover:text-destructive/80"
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                            </Button>
                        </div>
                    )}

                    {/* Replies Toggle */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplies(!showReplies)}
                                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                {showReplies ? (
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                ) : (
                                    <ChevronRight className="w-3 h-3 mr-1" />
                                )}
                                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </Button>
                        </div>
                    )}

                    {/* Reply Form */}
                    {isReplying && (
                        <div className="mt-3 space-y-2">
                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="min-h-[60px] resize-none"
                                disabled={isSubmitting}
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleReply}
                                    disabled={!replyText.trim() || isSubmitting}
                                >
                                    <Send className="w-3 h-3 mr-1" />
                                    Reply
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setIsReplying(false);
                                        setReplyText("");
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && showReplies && (
                <div className="ml-11 space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply._id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
});
