/** @format */

import Link from "next/link";
import { LogoHeader } from "./navigation/logo";
import { APP_NAME } from "@/settings/settings";
import {
    PRODUCT_LINKS,
    RESOURCE_LINKS,
    SOCIAL_LINKS,
} from "@/settings/navigation";
import { ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-t mt-20 from-foreground/5 to-background border-t">
            <div className="container w-full mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-full lg:col-span-1">
                        <LogoHeader />
                        <p className="mt-4 text-muted-foreground text-sm">
                            Gamifying classroom engagement through modern
                            technology
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide">
                            Product
                        </h4>
                        <nav className="space-y-2">
                            {PRODUCT_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-sm text-muted-foreground hover:underline hover:text-foreground transition-colors"
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide">
                            Resources
                        </h4>
                        <nav className="space-y-2">
                            {RESOURCE_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-1 text-sm items-center text-muted-foreground hover:underline hover:text-foreground transition-colors"
                                >
                                    {link.text} <ArrowRight size={12} />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Connect Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide">
                            Connect
                        </h4>
                        <div className="flex gap-4">
                            {SOCIAL_LINKS.map((social, index) => (
                                <Link
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors hover:-translate-y-0.5 transform"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                        © 2025 {APP_NAME}. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
