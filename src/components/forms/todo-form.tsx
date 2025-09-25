"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";

type Todo = Doc<"todos">;

interface TodoFormProps {
    todo?: Todo;
    onSuccess?: () => void;
}

const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    tags: z.array(z.string()).optional(),
    dueDate: z.number().optional().refine(
        (date) => {
            if (!date) return true; // Allow undefined/optional dates
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
            return date >= today.getTime();
        },
        {
            message: "Due date cannot be in the past",
        }
    ),
    isPublic: z.boolean(),
});

export function TodoForm({ todo, onSuccess }: TodoFormProps) {
    const createTodo = useMutation(api.todos.create);
    const updateTodo = useMutation(api.todos.update);

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof todoSchema>>({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: todo?.title || "",
            description: todo?.description || "",
            status: todo?.status || "TODO",
            priority: todo?.priority || "LOW",
            tags: todo?.tags || [],
            dueDate: todo?.dueDate,
            isPublic: todo?.isPublic ?? false,
        },
    });


    const onSubmit = async (values: z.infer<typeof todoSchema>) => {
        setIsLoading(true);
        try {
            if (todo?._id) {
                await updateTodo({ id: todo._id, ...values });
                toast.success("Task updated successfully");
            } else {
                await createTodo(values);
                toast.success("Task created successfully");
            }
            form.reset();
            onSuccess?.();
        } catch (error) {
            console.error("Failed to save task:", error);
            toast.error("Failed to save task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full border-0 shadow-none">
            <CardHeader className="pb-4">
                <CardTitle>{todo ? "Edit" : "Create"} Task</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            {...form.register("title")}
                            placeholder="Enter task title"
                            disabled={isLoading}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...form.register("description")}
                            placeholder="Enter task description"
                            disabled={isLoading}
                            rows={3}
                        />
                    </div>

                    {/* Status and Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(value) => form.setValue("status", value as "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED")}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODO">To Do</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={form.watch("priority")}
                                onValueChange={(value) => form.setValue("priority", value as "LOW" | "MEDIUM" | "HIGH")}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            className="w-48"
                            value={form.watch("dueDate") ? new Date(form.watch("dueDate")!).toISOString().split('T')[0] : ""}
                            onChange={(e) => {
                                const dateValue = e.target.value ? new Date(e.target.value).getTime() : undefined;
                                form.setValue("dueDate", dateValue);
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={isLoading}
                        />
                        {form.formState.errors.dueDate && (
                            <p className="text-sm text-destructive">{form.formState.errors.dueDate.message}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {["Design", "Development", "Research", "Marketing", "Bug Fix"].map((tag) => {
                                const isSelected = form.watch("tags")?.includes(tag) || false;
                                return (
                                    <Badge
                                        key={tag}
                                        variant={isSelected ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            const currentTags = form.watch("tags") || [];
                                            if (isSelected) {
                                                form.setValue("tags", currentTags.filter(t => t !== tag));
                                            } else {
                                                form.setValue("tags", [...currentTags, tag]);
                                            }
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>

                    {/* Public/Private */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPublic"
                            checked={form.watch("isPublic")}
                            onCheckedChange={(checked) => form.setValue("isPublic", !!checked)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="isPublic" className="text-sm">
                            Make this task public (visible to other users)
                        </Label>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? "Saving..." : todo ? "Update" : "Create"} Task
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
