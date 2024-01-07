import "./globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import ThemeProvider from "@/providers/ThemeProvider";
import Header from "@/components/header/Header";
import Menu from "@/components/menu/Menu";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gallery app",
  description:
    "Gallery app: Collect, share, and enjoy photos anytime, anywhere.",
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    shortcut: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} relative bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <Header />
            <main className="container flex md:gap-4">
              <Menu />
              <div className="w-full">{children}</div>
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
