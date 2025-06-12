import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TodoModal } from "@/components/modals/todo-modal";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/todo.svg",
      href: "/todo.svg",
    },
  ],
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} `} suppressHydrationWarning>
        <Providers>
          <NuqsAdapter>
            <TodoModal />
            <Toaster />
            {children}
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
