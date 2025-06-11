import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TodoDetailsSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-4 w-32 mb-2" />

      <Card className="rounded-2xl shadow-md p-6">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4 mb-6">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full max-w-md" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Badge row */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            {/* Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>

          {/* Timestamps */}
          <div className="flex justify-between text-sm mt-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
