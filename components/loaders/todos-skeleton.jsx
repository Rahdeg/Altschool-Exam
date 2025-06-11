import { PencilIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const TodoCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between w-full">
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
            <Button variant="ghost" size="icon" disabled onClick={() => {}}>
              <PencilIcon className="size-4 text-gray-300" />
            </Button>
            <Button size="icon" className="bg-red-200" disabled>
              <Trash className="size-4 text-red-400" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoCardSkeleton;
