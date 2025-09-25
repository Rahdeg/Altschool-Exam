"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    MessageSquare,
    Heart,
    MessageCircle,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { AdminThemeToggle } from "./admin-theme-toggle";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Todos", href: "/admin/todos", icon: CheckSquare },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Reactions", href: "/admin/reactions", icon: Heart },
    { name: "Chat", href: "/admin/chat", icon: MessageCircle },
];

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const isSessionValid = useQuery(
        api.admin.verifyAdminSession,
        sessionToken ? { sessionToken } : "skip"
    );
    const logoutAdmin = useMutation(api.admin.logoutAdmin);

    useEffect(() => {
        const token = localStorage.getItem("adminSessionToken");
        const expires = localStorage.getItem("adminSessionExpires");

        if (token && expires) {
            // Check if session is expired
            if (parseInt(expires) > Date.now()) {
                setSessionToken(token);
            } else {
                // Session expired, clear storage
                localStorage.removeItem("adminSessionToken");
                localStorage.removeItem("adminSessionExpires");
                router.push("/admin");
            }
        } else {
            router.push("/admin");
        }
    }, [router]);

    // Close mobile menu when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        if (sessionToken) {
            try {
                await logoutAdmin({ sessionToken });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        localStorage.removeItem("adminSessionToken");
        localStorage.removeItem("adminSessionExpires");
        setSessionToken(null);
        toast.success("Logged out successfully");
        router.push("/admin");
    };

    // Show loading while checking session
    if (isSessionValid === undefined) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Redirect if session is invalid
    if (isSessionValid === false) {
        router.push("/admin");
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-4 w-4" />
                    ) : (
                        <Menu className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                <div className="p-6">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/todo.svg"
                                alt="TaskyFlow Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8"
                            />
                            <h1 className="text-xl font-bold text-card-foreground">{siteConfig.name}</h1>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-primary text-primary-foreground shadow-sm border border-primary/20"
                                        : "hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="relative">
                                        <Icon className="h-4 w-4" />
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-foreground rounded-full" />
                                        )}
                                    </div>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-8 pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Desktop header */}
                <div className="hidden lg:block border-b border-border bg-card">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-card-foreground">
                                    TaskyFlow Admin Dashboard
                                </h2>
                                {(() => {
                                    const currentPage = navigation.find(item => pathname === item.href);
                                    return currentPage && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {currentPage.name}
                                        </p>
                                    );
                                })()}
                            </div>
                            <div className="flex items-center space-x-3">
                                <AdminThemeToggle />
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
