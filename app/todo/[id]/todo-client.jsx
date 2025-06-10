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
import { ro } from "date-fns/locale";
import { PencilIcon, Trash } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
      }
    };
  };

  if (isLoading) return <p>Loading</p>;
  if (error) return <p className="p-6 text-red-500">Todo not found</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 ">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Todos
      </Link>
      <Card className="rounded-2xl shadow-md p-6">
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

        <CardContent className="space-y-4">
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
                {todo.status}
              </Badge>
              {todo.tags && <Badge> {todo.tags}</Badge>}
              {todo.duration && (
                <Badge className="bg-orange-400"> {todo.duration} MINS</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className=" cursor-pointer"
                onClick={() => openModal("edit", todo)}
              >
                <span className="hidden md:block">Update Todo</span>

                <PencilIcon className="size-4 text-black cursor-pointer ml-2" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className=" cursor-pointer bg-red-500 hover:bg-red-600 ">
                    <span className="hidden md:block">Delete Todo</span>

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
                      your account and remove your data from our servers.
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

          <div className="flex  justify-between text-sm text-muted-foreground mt-6 w-full">
            <span>Created on {formatISODate(todo.createdAt)}</span>
            <span>Updated on {formatISODate(todo.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
