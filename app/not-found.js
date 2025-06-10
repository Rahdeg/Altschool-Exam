// src/app/not-found.js
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <Ghost className="h-20 w-20 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-bold tracking-tight">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="mt-6 cursor-pointer">
        <Link href="/">
          <Button size="lg" className="cursor-pointer">
            Go Back Home
          </Button>
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        If you believe this is an error, please contact support.
      </p>
    </div>
  );
}
