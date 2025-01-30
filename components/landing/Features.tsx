/** @format */

import { MonitorCog, Wand2, Dices, ScrollText, Hammer } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { APP_NAME } from "@/settings/settings";
import React from "react";
import { cn } from "@/lib/utils"; // Make sure you have this utility file

// Define types
interface ContentItem {
    name: string;
    description: string;
}

interface FeatureCardProps {
    title: string;
    description: string;
    content: ContentItem[];
    underConstruction: boolean;
    icon: React.ComponentType<{ className?: string }>;
}

// FeatureCard component
// eslint-disable-next-line react/display-name
const FeatureCard = React.memo(
    ({
        title,
        description,
        content,
        underConstruction,
        icon: Icon,
    }: FeatureCardProps) => {
        return (
            <Card
                className={cn(
                    "bg-foreground/5 md:bg-background",
                    underConstruction && "opacity-50"
                )}
            >
                <CardHeader className="p-4">
                    <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-foreground" />
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-4">
                    <ul className="space-y-2 list-disc ml-5">
                        {content.map((bullet: ContentItem, i: number) => (
                            <li
                                key={i}
                                className="text-xs leading-relaxed"
                            >
                                <strong className="font-medium">
                                    {bullet.name}:
                                </strong>
                                <span className="text-muted-foreground">
                                    {" "}
                                    {bullet.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        );
    }
);

// Main component
export default function FeaturesSection() {
    return (
        <div className="w-full mx-auto mt-20">
            <div className="px-4 max-w-7xl flex flex-col justify-center items-center mx-auto">
                <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
                    <h2
                        id="features"
                        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                    >
                        Your time as a teacher is extremely valuable
                    </h2>
                    <p className="text-muted-foreground">
                        As a teacher myself, I know I&apos;m expected to do too
                        much.{" "}
                    </p>
                    <p className="text-muted-foreground">
                        Use {APP_NAME} to quickly manage your class with
                        classroom screens, track attendance, auto-generate
                        worksheets, and assign students fairly. Everything is
                        designed to save you time, keep students engaged, and
                        make your life as a teacher far easier.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featureCards.map((item, index) => (
                        <FeatureCard
                            key={index}
                            title={item.title}
                            description={item.description}
                            content={item.content}
                            underConstruction={item.underConstruction}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const featureCards = [
    {
        title: "Screens",
        description: "Display & control classroom screens easily.",
        icon: MonitorCog,
        link: "/features#screens",
        underConstruction: true,
        content: [
            {
                name: "Classroom Screen",
                description: "for the whole class to see",
            },
            {
                name: "Teacher Screen",
                description: "control the classroom screen on mobile",
            },
        ],
    },
    {
        title: "Tools",
        description: "Helpful add-ons for everyday tasks.",
        icon: Hammer,
        link: "/features#tools",
        underConstruction: false,
        content: [
            {
                name: "Attendance",
                description: "quickly manage daily attendance",
            },
            {
                name: "Noise Monitor",
                description: "alert the class if it gets too loud",
            },
            {
                name: "Points",
                description: "reward or deduct points for student behavior",
            },
            {
                name: "Tasks",
                description: "manage student tasks so they know what to do",
            },
            {
                name: "Expectations",
                description: "set student expectations, like essay length",
            },
        ],
    },
    {
        title: "Generators",
        description: "Auto-create custom worksheets with or without AI.",
        icon: Wand2,
        link: "/features#generators",
        underConstruction: true,
        content: [
            {
                name: "Cloze",
                description: "auto-generate fill-in-the-blank passages",
            },
            {
                name: "Crossword Puzzle",
                description: "easily create fun puzzles",
            },
            {
                name: "Word Search",
                description: "generate random word searches",
            },
        ],
    },
    {
        title: "Assigners",
        description: "Fairly distribute tasks & seating.",
        icon: Dices,
        link: "/features#assigners",
        underConstruction: false,
        content: [
            {
                name: "Random",
                description: "pick a random student or group",
            },
            {
                name: "Round-Robin",
                description: "ensure everyone gets a turn",
            },
            {
                name: "Seats",
                description:
                    "assign seats, prioritizing new neighbors and seats",
            },
        ],
    },
    {
        title: "Student Dashboard",
        description:
            "Empower students to track points and behavior at a glance.",
        icon: ScrollText,
        link: "/features#student-dashboard",
        underConstruction: false,
        content: [
            {
                name: "Point History",
                description: "review positive & negative point changes",
            },
            {
                name: "Behavior Stats",
                description: "quick breakdown of behaviors and rewards",
            },
            {
                name: "Redemption History",
                description: "see what has been redeemed",
            },
            {
                name: "Expectations",
                description: "see any expectations set for them",
            },
            {
                name: "Tasks",
                description: "see which tasks need to be worked on",
            },
        ],
    },
];
