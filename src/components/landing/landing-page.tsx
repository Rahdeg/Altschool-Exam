"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@/components/auth/user-button";
import { useConvexAuth } from "convex/react";
import {
    CheckCircle,
    MessageSquare,
    Users,
    Zap,
    Shield,
    Clock,
    ArrowRight,
    Plus,
    Heart
} from "lucide-react";
import Link from "next/link";

export function LandingPage() {
    const { isAuthenticated } = useConvexAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
            {/* Navigation */}
            <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <Image src="/todo.svg" alt="TaskyFlow" className="w-6 h-6" width={24} height={24} />
                            </div>
                            <span className="text-xl font-bold text-foreground">TaskyFlow</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <UserButton />
                            ) : (
                                <>
                                    <Link href="/auth">
                                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-accent">Sign In</Button>
                                    </Link>
                                    <Link href="/auth">
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <Badge variant="secondary" className="mb-6">
                        🚀 New: Real-time collaboration features
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
                        Organize Your Life with
                        <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                            {" "}Smart Tasks
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                        The ultimate collaborative task management platform. Create, organize, and collaborate on tasks with real-time updates, comments, and direct messaging.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-foreground bg-foreground text-background font-semibold hover:bg-foreground/90">
                            Watch Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/50 to-accent/50 dark:from-muted/20 dark:to-accent/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Everything you need to stay organized
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to boost your productivity and keep your team in sync.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <CheckCircle className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Smart Task Management</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Create, organize, and track tasks with priority levels, due dates, and custom tags.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <MessageSquare className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Real-time Comments</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Collaborate with your team through threaded comments and instant notifications.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Direct Messaging</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Communicate seamlessly with team members through integrated chat functionality.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Zap className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Lightning Fast</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Experience real-time updates and instant synchronization across all devices.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Shield className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Secure & Private</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Your data is protected with enterprise-grade security and privacy controls.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                            <CardHeader className="p-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <CardTitle className="text-xl font-semibold text-foreground mb-2">Smart Notifications</CardTitle>
                                <CardDescription className="text-muted-foreground leading-relaxed">
                                    Get timely reminders and stay updated with intelligent notification system.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                                See TaskyFlow in action
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                Watch how easy it is to create tasks, collaborate with your team, and stay organized.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-foreground">Create tasks in seconds</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-foreground">Real-time collaboration</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-foreground">Instant messaging</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">My Tasks</h3>
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                                            <span>Design new landing page</span>
                                            <Badge className="bg-yellow-500 text-white">High</Badge>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                                            <span>Review user feedback</span>
                                            <Badge className="bg-blue-500 text-white">Medium</Badge>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                                            <span>Update documentation</span>
                                            <Badge className="bg-green-500 text-white">Low</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>3 new comments</span>
                                        <Heart className="w-4 h-4 ml-auto" />
                                        <span>12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to boost your productivity?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of users who are already organized with TaskyFlow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100">
                                {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-gray-900">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                                    <Image src="/todo.svg" alt="TaskyFlow" className="w-5 h-5" width={20} height={20} />
                                </div>
                                <span className="text-lg font-bold text-foreground">TaskyFlow</span>
                            </div>
                            <p className="text-muted-foreground">
                                The ultimate collaborative task management platform.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Product</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Company</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Support</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
                        <p>&copy; 2024 TaskyFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
