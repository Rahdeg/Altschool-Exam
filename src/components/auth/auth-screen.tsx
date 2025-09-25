"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { AppCarousel } from "./app-carousel";


export function AuthScreen() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent">
            <div className="flex h-screen">
                {/* Left Column - Carousel (Desktop Only) */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-3/5">
                    <div className="w-full h-full relative">
                        <AppCarousel />
                    </div>
                </div>

                {/* Right Column - Auth Form */}
                <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
                    <div className="w-full max-w-md lg:max-w-lg">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">

                            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to TaskyFlow</h1>
                            <p className="text-base text-muted-foreground">Sign in to your account or create a new one</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block text-center mb-8">
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                {mode === "signin" ? "Welcome Back" : "Join TaskyFlow"}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {mode === "signin"
                                    ? "Sign in to continue to your dashboard"
                                    : "Create your account to get started"
                                }
                            </p>
                        </div>

                        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                                <div className="flex space-x-1 bg-muted/80 p-1.5 rounded-xl">
                                    <button
                                        onClick={() => setMode("signin")}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "signin"
                                            ? "bg-card text-card-foreground shadow-md"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => setMode("signup")}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "signup"
                                            ? "bg-card text-card-foreground shadow-md"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                {mode === "signin" ? <SignInCard /> : <SignUpCard />}
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    );
}
