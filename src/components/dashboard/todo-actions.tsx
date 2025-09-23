"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    Edit,
    MessageSquare,
    Eye,
    EyeOff,
    Trash2,
    MessageCircle,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { TodoForm } from "@/components/forms/todo-form";
import { CommentSheet } from "./comment-sheet";

type Todo = Doc<"todos"> & {
    user: {
        _id: string | undefined;
        name: string | undefined;
        email: string | undefined;
        image?: string | undefined;
    };
    commentCount?: number;
    reactionCount?: number;
};

interface TodoActionsProps {
    todo: Todo;
    onTodoUpdate?: () => void;
}

export function TodoActions({ todo, onTodoUpdate }: TodoActionsProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCommentSheet, setShowCommentSheet] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const router = useRouter();
    const currentUser = useCurrentUser();
    const updateTodo = useMutation(api.todos.update);
    const deleteTodo = useMutation(api.todos.remove);
    const createOrGetConversation = useMutation(api.chats.createOrGetConversation);

    const isOwner = currentUser?._id === todo.userId;

    const handleVisibilityToggle = async () => {
        try {
            await updateTodo({
                id: todo._id,
                isPublic: !todo.isPublic,
            });
            toast.success(`Task ${!todo.isPublic ? "made public" : "made private"}`);
            onTodoUpdate?.();
        } catch (error) {
            console.error("Failed to update visibility:", error);
            toast.error("Failed to update visibility");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTodo({ id: todo._id });
            toast.success("Task deleted successfully");
            onTodoUpdate?.();
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleComment = () => {
        setShowCommentSheet(true);
    };

    const handleMessage = async () => {
        if (!currentUser) {
            toast.error("You must be logged in to send messages");
            return;
        }

        // Don't allow messaging yourself
        if (currentUser._id === todo.userId) {
            toast.info("You can't message yourself about your own todo");
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

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48" side="bottom" alignOffset={-5} sideOffset={5}>
                    {isOwner ? (
                        // Owner actions
                        <>
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleComment}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Comments
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleMessage}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleVisibilityToggle}>
                                {todo.isPublic ? (
                                    <>
                                        <EyeOff className="w-4 h-4 mr-2" />
                                        Make Private
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Make Public
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </>
                    ) : (
                        // Non-owner actions
                        <>
                            <DropdownMenuItem onClick={handleComment}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Comments
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleMessage}>
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Message
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-border">
                        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-card-foreground">Edit Task</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowEditModal(false)}
                            >
                                <MoreHorizontal className="w-4 h-4 rotate-45" />
                            </Button>
                        </div>
                        <div className="p-4">
                            <TodoForm
                                todo={todo}
                                onSuccess={() => {
                                    setShowEditModal(false);
                                    onTodoUpdate?.();
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Comment Sheet */}
            {showCommentSheet && (
                <CommentSheet
                    todoId={todo._id}
                    isOpen={showCommentSheet}
                    onClose={() => setShowCommentSheet(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-lg w-full max-w-md shadow-lg border border-border">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                Delete Task
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete &quot;{todo.title}&quot;? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        handleDelete();
                                        setShowDeleteConfirm(false);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
