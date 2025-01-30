/** @format */

// ./pages/404.tsx

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import BackButton from "@/components/BackButton";
import image404 from "../public/images/sprouty-404.png";

export default function Custom404() {
    return (
        <div className="min-h-screen flex items-start mt-10 justify-center ">
            <Card className="max-w-md w-full p-6 shadow-lg rounded-lg bg-foreground/5">
                <CardHeader className="flex flex-col items-center">
                    <CardDescription>404 Not Found</CardDescription>
                    {/* Fun SVG Art */}
                    <Image
                        src={image404}
                        alt="Funny Robot"
                        width={300}
                        height={300}
                        className="mb-4"
                        placeholder="blur"
                        blurDataURL=""
                    />
                    <CardTitle className="text-3xl font-bold">Oops!</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4">
                        Looks like you&apos;ve stumbled upon a page that
                        doesn&apos;t exist.
                    </p>
                    <p className="mb-6">
                        Don&apos;t worry, let&apos;s get you back on track!
                    </p>
                </CardContent>
                <CardFooter className="flex gap-5 flex-col justify-center">
                    <BackButton />
                    <Link href="/">
                        <Button
                            variant="secondary"
                            className="w-full"
                        >
                            Go Home <ArrowRight />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
