/** @format */

import { APP_NAME } from "@/settings/settings";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../ui/accordion";

export default function FAQ() {
    return (
        <div className="w-full mx-auto mt-20">
            <div className=" px-4 max-w-7xl flex flex-col justify-center items-center mx-auto">
                <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
                    <h2
                        id="faq"
                        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                    >
                        FAQ
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Got questions? We&apos;ve got answers.
                    </p>
                </div>
                <Accordion
                    type="single"
                    collapsible
                    className="w-full max-w-2xl"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Why is it free right now?
                        </AccordionTrigger>
                        <AccordionContent>
                            {APP_NAME} is currently free for authorized users
                            because we are in alpha. Alpha means that not all of
                            the core features are implemented. At some point, we
                            will have a public beta.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
