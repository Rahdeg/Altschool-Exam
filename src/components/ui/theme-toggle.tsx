"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const themes = [
        { key: "light", icon: Sun, label: "Light Mode" },
        { key: "dark", icon: Moon, label: "Dark Mode" },
        { key: "system", icon: Monitor, label: "System Mode" },
    ]

    return (
        <div className="flex items-center w-full bg-muted p-1 rounded-lg">
            {themes.map((themeOption, index) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.key

                return (
                    <React.Fragment key={themeOption.key}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 h-8 p-0 ${isActive ? "bg-background shadow-sm" : ""}`}
                            onClick={() => setTheme(themeOption.key)}
                            title={themeOption.label}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                        {index < themes.length - 1 && (
                            <div className="w-px h-4 bg-border mx-1" />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
