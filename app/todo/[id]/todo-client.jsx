"use client";

import TodoDetailsSkeleton from "@/components/loaders/todo-skeleton";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRepoModal } from "@/hooks/use-modal";
import { useTodos } from "@/hooks/use-todos";
import { cn, formatISODate, priorityColor, statusColor } from "@/lib/utils";
import { PencilIcon, Trash } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export const dynamic = "force-dynamic";

export default function TodoPage({ props }) {
  const { getOne } = useTodos({});
  const { data: todo, isLoading, error } = getOne(props);
  const { openModal } = useRepoModal();
  const router = useRouter();

  const { remove } = useTodos({});

  const handleDelete = (id) => {
    return async () => {
      try {
        await remove.mutateAsync(id);
        router.push("/");
      } catch (error) {
        console.error("Failed to delete todo:", error);
        toast.error("Failed to delete todo", {
          description:
            "There was an error deleting the todo. Please try again.",
        });
      }
    };
  };

  if (isLoading) return <TodoDetailsSkeleton />;
  if (error) return <p className="p-6 text-red-500">Todo not found</p>;

  return (
    <main className="max-w-4xl mx-auto px-2 md:px-4 py-8 ">
      <div className="flex items-center justify-between ">
        <Link
          href="/"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to Todos
        </Link>
        <Link
          href="/testerror"
          className="text-red-500 hover:underline mb-4 inline-block"
        >
          Trigger error
        </Link>
        <Link
          href="/gear"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          404 Page
        </Link>
      </div>

      <Card className="rounded-2xl shadow-md px-2 py-6 md:p-6 ">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{todo.name}</h1>
                <p className="text-sm text-muted-foreground"></p>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <p>{todo.description || "No description provided."}</p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 md:space-y-4">
          <div className=" flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {todo.priority && (
                <Badge
                  className={cn(
                    priorityColor[todo.priority?.toLowerCase()] || ""
                  )}
                >
                  {todo.priority}
                </Badge>
              )}

              <Badge
                className={cn(
                  statusColor[todo.status] || "bg-muted text-muted-foreground"
                )}
              >
                {todo.status === "IN_PROGRESS" ? "IN PROGRESS" : todo.status}
              </Badge>
              {todo.tags && <Badge> {todo.tags}</Badge>}
              {todo.duration && (
                <Badge className="bg-orange-400"> {todo.duration} MINS</Badge>
              )}
            </div>
            <div className="  hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                className=" cursor-pointer"
                onClick={() => openModal("edit", todo)}
              >
                <span>Update Task</span>

                <PencilIcon className="size-4 text-black cursor-pointer ml-2" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className=" cursor-pointer bg-red-500 hover:bg-red-600 ">
                    <span>Delete Task</span>

                    <Trash className="size-4 text-white  ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your task and remove your data from the todo.
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

          {(todo.start || todo.end) && (
            <div className="flex  justify-between text-sm text-muted-foreground mt-6 w-full">
              <span>
                Task Starts {formatISODate(todo.start, "MMMM do, yyyy HH:mm")}
              </span>
              <span>
                Task Ends {formatISODate(todo.end, "MMMM do, yyyy HH:mm")}
              </span>
            </div>
          )}

          <div className="flex  justify-between text-sm text-muted-foreground mt-10 md:mt-6 w-full">
            <span>
              Created {formatISODate(todo.createdAt, "MMMM do, yyyy HH:mm")}
            </span>
          </div>

          <div className="flex justify-between md:hidden  w-full mt-10">
            <Button
              variant="ghost"
              className=" cursor-pointer"
              onClick={() => openModal("edit", todo)}
            >
              <span>Update Task</span>

              <PencilIcon className="size-4 text-black cursor-pointer ml-2" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className=" cursor-pointer bg-red-500 hover:bg-red-600 ">
                  <span className="">Delete Task</span>

                  <Trash className="size-4 text-white  ml-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your task and remove your data from the todo.
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
        </CardContent>
      </Card>
    </main>
  );
}
