/** @format */

import Link from "next/link";
import Image from "next/image";

export default function KofiDonation() {
    return (
        <Link
            href={"https://ko-fi.com/mikitz"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:shadow-xl transform transition-transform hover:scale-105"
        >
            <Image
                src={"/brands/support_me_on_kofi_blue.png"}
                alt="Support me on Kofi"
                width={225}
                height={100}
            />
        </Link>
    );
}
