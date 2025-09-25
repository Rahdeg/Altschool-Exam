"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NotificationSettings } from "./notification-settings";

export function AccountSettings() {
    const router = useRouter();
    const currentUser = useQuery(api.users.getCurrentUser);
    const updateProfile = useMutation(api.users.updateProfile);

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: "",
        image: "",
    });

    // Initialize form data when user data loads
    useEffect(() => {
        if (currentUser) {
            setProfileData({
                name: currentUser.name || "",
                image: currentUser.image || "",
            });
        }
    }, [currentUser]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        // Basic validation
        if (profileData.name.trim().length < 2) {
            toast.error("Name must be at least 2 characters long");
            return;
        }

        if (profileData.image && !isValidUrl(profileData.image)) {
            toast.error("Please enter a valid image URL");
            return;
        }

        setIsUpdatingProfile(true);
        try {
            await updateProfile({
                name: profileData.name.trim(),
                image: profileData.image.trim() || undefined,
            });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };


    if (!currentUser) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    const userInitials = currentUser.name
        ? currentUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : currentUser.email?.[0]?.toUpperCase() || "U";

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                        <p className="text-muted-foreground">Update your profile information</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-card border rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={profileData.image} alt={profileData.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label htmlFor="image" className="text-sm font-medium text-foreground">
                                    Profile Picture URL
                                </Label>
                                <Input
                                    id="image"
                                    type="url"
                                    value={profileData.image}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, image: e.target.value }))}
                                    placeholder="https://example.com/your-photo.jpg"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter your full name"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={currentUser.email || ""}
                                    disabled
                                    className="mt-1 bg-muted"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Email cannot be changed. Contact support if needed.
                                </p>
                            </div>
                        </div>

                        <Button type="submit" disabled={isUpdatingProfile} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdatingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </div>

                {/* Notification Settings */}
                <div className="mt-6">
                    <NotificationSettings />
                </div>
            </div>
        </div>
    );
}
