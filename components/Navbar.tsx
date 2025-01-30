/** @format */

import { NAV_LINKS } from "@/settings/navigation";
import { LuArrowRight } from "react-icons/lu";
import Anchor from "@/components/navigation/anchor";
import { ModeToggle } from "./ui/theme-toggle";
import { LogoHeader } from "./navigation/logo";
import { SheetLeft } from "@/components/navigation/sidebar";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full h-16 border-b backdrop-filter backdrop-blur-xl bg-opacity-5 md:px-4 px-2">
            <div className="mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2 max-w-6xl">
                <div className="flex items-center gap-5">
                    <SheetLeft />
                    <div className="flex items-center gap-6">
                        <LogoHeader />
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center justify-center gap-5 text-sm font-medium text-muted-foreground">
                        <NavMenu />
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button variant="default">
                            <Link
                                href="https://forms.gle/NTZgCEQSxMzmdDYY7"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Beta sign up
                            </Link>
                        </Button>
                        <div className="flex sm:ml-0 gap-2">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export function NavMenu({ isSheet = false }) {
    return (
        <>
            {NAV_LINKS.map((item) => {
                const Comp = (
                    <Anchor
                        key={item.title + item.href}
                        activeClassName="font-bold text-primary"
                        absolute
                        className="flex items-center gap-1 text-sm"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                    >
                        {item.title}{" "}
                        {item.external && (
                            <LuArrowRight
                                className="w-3 h-3 align-super"
                                strokeWidth={3}
                            />
                        )}
                    </Anchor>
                );
                return isSheet ? (
                    <SheetClose
                        key={item.title + item.href}
                        asChild
                    >
                        {Comp}
                    </SheetClose>
                ) : (
                    Comp
                );
            })}
        </>
    );
}
