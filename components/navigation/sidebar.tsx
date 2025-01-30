/** @format */

import { LuAlignLeft } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NavMenu } from "../Navbar";
import { LogoHeader } from "./logo";

export function SheetLeft() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden flex"
                >
                    <LuAlignLeft className="!size-6" />
                </Button>
            </SheetTrigger>
            <SheetContent
                className="flex flex-col gap-4 px-0"
                side="left"
            >
                <DialogTitle className="sr-only">Menu</DialogTitle>
                <SheetHeader>
                    <SheetClose
                        className="ml-5"
                        asChild
                    >
                        <LogoHeader />
                    </SheetClose>
                </SheetHeader>
                <ScrollArea className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2.5 mt-3 mx-0 px-5">
                        <NavMenu isSheet />
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
