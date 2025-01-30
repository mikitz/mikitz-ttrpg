/** @format */

import KofiDonation from "./KofiButton";
import PatreonDonation from "./PatreonButton";

export default function DonateSection() {
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
                        Donations
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        If you are not subscribed, but find this site useful,
                        please donate. Every little bit helps.
                    </p>
                </div>
                <div className="flex gap-5 justify-center items-center">
                    <KofiDonation />
                    <PatreonDonation />
                </div>
            </div>
        </div>
    );
}
