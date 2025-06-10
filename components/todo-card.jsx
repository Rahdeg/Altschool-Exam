import React from "react";
import { Badge } from "./ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DeleteIcon, PencilIcon, Trash } from "lucide-react";
import { Button } from "./ui/button";

// 🎨 Priority colors
const priorityColor = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

// 🎨 Status colors
const statusColor = {
  TODO: "bg-[#008f0a] text-white",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
};

export const TodoCard = ({ status, title, time, priority, tags }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="bg-white rounded-2xl rounded-r-none shadow p-4 w-full max-w-2xl flex items-center justify-between">
        <div>
          <div className="mb-2">
            <div className="flex gap-x-2 items-center">
              <Badge
                className={cn(priorityColor[priority?.toLowerCase()] || "")}
              >
                {priority}
              </Badge>
              {tags && (
                <Badge className="bg-blue-100 text-blue-800">{tags}</Badge>
              )}
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{time}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Badge
            className={cn(
              statusColor[status] || "bg-muted text-muted-foreground"
            )}
          >
            {status}
          </Badge>
        </div>
      </div>
      <div className=" rounded-2xl bg-white rounded-l-none p-2 h-full w-fit flex-col flex items-center justify-center gap-y-2 ml-1">
        <Button variant="ghost" size="icon" className=" cursor-pointer">
          <PencilIcon className="size-4 text-gray-500 cursor-pointer" />
        </Button>

        <Button
          size="icon"
          className=" cursor-pointer bg-red-500 hover:bg-red-600"
        >
          <Trash className="size-4 text-white " />
        </Button>
      </div>
    </div>
  );
};

export const TodoCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left card section */}
      <div className="bg-white rounded-2xl rounded-r-none shadow p-4 w-full max-w-2xl flex items-center justify-between">
        <div>
          <div className="mb-2">
            <div className="flex gap-x-2 items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Right action section */}
      <div className="rounded-2xl bg-white rounded-l-none p-2 h-full w-fit flex-col flex items-center justify-center gap-y-2 ml-1">
        <Button variant="ghost" size="icon" disabled>
          <PencilIcon className="size-4 text-gray-300" />
        </Button>
        <Button size="icon" className="bg-red-200" disabled>
          <Trash className="size-4 text-red-400" />
        </Button>
      </div>
    </div>
  );
};

export default TodoCardSkeleton;
