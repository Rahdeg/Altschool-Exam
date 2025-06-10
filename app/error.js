"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("An error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <AlertTriangle className="h-20 w-20 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold tracking-tight text-destructive">
        Something went wrong
      </h1>

      <p className="text-sm text-muted-foreground mb-2 max-w-xl mt-2">
        {error?.message || "Unknown error occurred."}
      </p>

      <div className="mt-6 space-x-4">
        <Button onClick={() => reset()} variant="default">
          Try Again
        </Button>
        <Link
          href="/"
          className="text-sm text-muted-foreground underline hover:text-primary"
        >
          Back to Home
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        If this keeps happening, contact support.
      </p>
    </div>
  );
}
