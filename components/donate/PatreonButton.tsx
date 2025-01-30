/** @format */

import Image from "next/image";
import Link from "next/link";

export default function PatreonDonation() {
    return (
        <Link
            href={"https://www.patreon.com/mikitz"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:shadow-xl transform transition-transform hover:scale-105"
        >
            <Image
                src={"/brands/become_a_patron_button.png"}
                alt="Become a Patreon"
                width={225}
                height={100}
            />
        </Link>
    );
}
