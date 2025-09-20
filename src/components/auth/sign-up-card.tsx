"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignUpCard() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useConvexAuth();
    const { signIn } = useAuthActions();

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await signIn("password", { email, password, name });
            router.push("/dashboard");
        } catch (error) {
            console.error("Sign up error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignUp = async (provider: string) => {
        setIsLoading(true);
        try {
            await signIn(provider);
            router.push("/dashboard");
        } catch (error) {
            console.error(`${provider} sign up error:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 hover:border-gray-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => handleOAuthSignUp("github")}
                    disabled={isLoading}
                >
                    <Github className="w-5 h-5 mr-3" />
                    Continue with GitHub
                </Button>
                <Button
                    variant="outline"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-900 hover:border-gray-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => handleOAuthSignUp("google")}
                    disabled={isLoading}
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </Button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium">
                    <span className="bg-white px-3 text-gray-500">Or continue with</span>
                </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-5">
                <div>
                    <Input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-14 text-base bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                </div>
                <div>
                    <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-14 text-base bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                </div>
                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-14 text-base bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                </div>
                <Button type="submit" className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5" disabled={isLoading}>
                    <Mail className="w-6 h-6 mr-3" />
                    Create Account
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
