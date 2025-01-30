/** @format */

import React from "react";
import { APP_NAME } from "@/settings/settings";

export default function PricingSection() {
    return (
        <div className="w-full mx-auto mt-20">
            {/* Pricing */}
            <div className="px-4 max-w-7xl flex flex-col justify-center items-center mx-auto">
                {/* Title */}
                <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
                    <h2
                        id="pricing"
                        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                    >
                        Pricing
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Explore all of the plans that {APP_NAME} has to offer.
                    </p>
                </div>
                <p className="max-w-2xl">
                    {APP_NAME} is currently in alpha and free for authorized
                    users only. Stay tuned for pricing information.
                </p>
                {/* <PricingCardGrid /> */}
                {/* <ComparisonTable /> */}
            </div>
        </div>
    );
}
