/** @format */

// components/landing/Hero.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DOMAIN_NAME } from "@/settings/settings";

export default function Hero() {
    return (
        <section
            id="hero"
            className="w-full h-dvh py-12 md:py-24 lg:py-32 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-primary/5"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/10" />

            {/* Content container with max width */}
            <div className="w-full max-w-4xl mx-auto px-4 md:px-6 relative z-10">
                {/* Social Proof & Blog Link */}
                <div className="flex flex-col justify-between h-full items-center gap-4 mb-8">
                    <Link href={`https://blog.${DOMAIN_NAME}/blog/new-feature`}>
                        <Badge
                            variant="secondary"
                            className="gap-2 hover:bg-secondary/80"
                        >
                            🎉 New Feature: Dancing Abyssal Chickens{" "}
                            <ArrowRight className="h-4 w-4" />
                        </Badge>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold tracking-tighter md:text-6xl lg:text-7xl text-foreground">
                            Something something{" "}
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                TTPRG{" "}
                            </span>
                            tools for things.
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl">
                            Automate things for TTRPG things.{" "}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-wrap flex-col md:flex-row gap-2 justify-center items-stretch">
                        <Button
                            variant="default"
                            className="h-12 px-8 text-lg"
                        >
                            <Link
                                href=""
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Generate things
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-12 px-8 text-lg"
                        >
                            <Link href="#features">Learn things</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Animated border bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
        </section>
    );
}
