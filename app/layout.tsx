/** @format */

import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_NAME } from "@/settings/settings";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
    adjustFontFallback: false,
});

const snapItc = localFont({
    variable: "--font-snap-itc",
    src: "./fonts/Snap-ITC.ttf",
});

export const metadata: Metadata = {
    title: `${APP_NAME} - Home`,
    description: "Tools for classroom management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${snapItc.variable} scroll-smooth antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TooltipProvider>
                        <Navbar />
                        <main className="h-auto">{children}</main>
                        <Footer />
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
