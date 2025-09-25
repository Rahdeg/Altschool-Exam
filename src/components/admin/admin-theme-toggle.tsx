"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { key: "light", icon: Sun, label: "Light Mode" },
        { key: "dark", icon: Moon, label: "Dark Mode" },
        { key: "system", icon: Monitor, label: "System Mode" },
    ];

    const currentTheme = themes.find((t) => t.key === theme) || themes[2];
    const CurrentIcon = currentTheme.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <CurrentIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                        <DropdownMenuItem
                            key={themeOption.key}
                            onClick={() => setTheme(themeOption.key)}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <Icon className="h-4 w-4" />
                            <span>{themeOption.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
