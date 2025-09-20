"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export function AuthScreen() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to TaskyFlow</h1>
                    <p className="text-lg text-gray-600">Sign in to your account or create a new one</p>
                </div>

                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="flex space-x-1 bg-gray-100/80 p-1.5 rounded-xl">
                            <button
                                onClick={() => setMode("signin")}
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "signin"
                                    ? "bg-white text-gray-900 shadow-md"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode("signup")}
                                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "signup"
                                    ? "bg-white text-gray-900 shadow-md"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                    <p className="text-sm text-gray-600">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
