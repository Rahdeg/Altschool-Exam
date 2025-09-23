"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import Image from "next/image";

export function AuthScreen() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary to-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Image src="/todo.svg" alt="TaskyFlow" className="w-10 h-10" width={40} height={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to TaskyFlow</h1>
                    <p className="text-lg text-muted-foreground">Sign in to your account or create a new one</p>
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

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
