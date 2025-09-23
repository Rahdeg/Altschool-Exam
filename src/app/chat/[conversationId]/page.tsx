"use client";

import { useParams, useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { IndividualChat } from "@/components/chat/individual-chat";

export default function ChatPage() {
    const { conversationId } = useParams();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect to auth page
    }

    if (!conversationId || typeof conversationId !== "string") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Chat not found</h1>
                    <p className="text-muted-foreground">The conversation you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    return <IndividualChat conversationId={conversationId} />;
}
