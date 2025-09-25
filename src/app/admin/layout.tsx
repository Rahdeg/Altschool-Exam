import type { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "Admin Dashboard | TaskyFlow",
    description: "TaskyFlow Admin Dashboard - Monitor and manage your application",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en" suppressHydrationWarning>
                <body className="antialiased">
                    <ConvexClientProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </ConvexClientProvider>
                    <Toaster />
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
