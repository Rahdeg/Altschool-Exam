"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatISODate, priorityColor, statusColor } from "@/lib/utils";
import { DeleteIcon, PencilIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRepoModal } from "@/hooks/use-modal";
import { useTodos } from "@/hooks/use-todos";
import { Hint } from "./hint";

// 🎨 Priority colors

export const TodoCard = ({ todo }) => {
  const { openModal } = useRepoModal();
  const { remove } = useTodos({});

  const handleDelete = (id) => {
    return async () => {
      try {
        await remove.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    };
  };

  return (
    <div className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-50 transition-all duration-200 ease-in-out">
      <Link href={`/todo/${todo.id}`} className="w-full">
        <div className="bg-white rounded-2xl rounded-r-none shadow p-4 w-full max-w-2xl flex items-center justify-between">
          <div>
            <div className="mb-2">
              <div className="flex gap-x-2 items-center">
                <Badge
                  className={cn(
                    priorityColor[todo.priority?.toLowerCase()] || ""
                  )}
                >
                  {todo.priority}
                </Badge>
                {todo.tags && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {todo.tags}
                  </Badge>
                )}
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 uppercase line-clamp-1">
              {todo.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {" "}
              {formatISODate(todo.createdAt, "MMMM do, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Badge
              className={cn(
                statusColor[todo.status] || "bg-muted text-muted-foreground"
              )}
            >
              {todo.status === "IN_PROGRESS" ? "IN PROGRESS" : todo.status}
            </Badge>
          </div>
        </div>
      </Link>

      <div className=" rounded-2xl bg-white rounded-l-none p-2 h-full w-fit flex-col flex items-center justify-center gap-y-2 ml-1">
        <Hint label="Edit task" side="right" align="start">
          <Button
            variant="ghost"
            size="sm"
            className=" cursor-pointer"
            onClick={() => openModal("edit", todo)}
          >
            <PencilIcon className="size-4 text-black cursor-pointer" />
          </Button>
        </Hint>

        <AlertDialog>
          <Hint label="Delete task" side="right" align="start">
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className=" cursor-pointer bg-red-500 hover:bg-red-600 size-6"
              >
                <Trash className="size-4 text-white " />
              </Button>
            </AlertDialogTrigger>
          </Hint>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                task and remove your data from the todo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete(todo.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
