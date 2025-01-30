/** @format */

import {
    BookOpen,
    Calendar,
    Globe,
    Hexagon,
    ShoppingBag,
    User,
    MapPin,
    Map as MapIcon, // Import and alias the Map icon
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import React from "react";
import { cn } from "@/lib/utils"; // Ensure this utility exists

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
                        className="font-[family-name:var(--font-snap-itc) scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
                    >
                        Features
                    </h2>
                    <p className="text-muted-foreground">
                        Things to enhance your things for things.
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
        title: "Battle Map Generator",
        description:
            "Generate fully customizable random battle maps considering biome, climate, and season.",
        icon: MapIcon, // Use the aliased MapIcon
        link: "/features#battle-map-generator",
        underConstruction: false,
        content: [
            {
                name: "Customization",
                description:
                    "Adjust biome, climate, season, height, width, and grid size.",
            },
            {
                name: "Export Options",
                description:
                    "Export maps as image, JSON, UVTT, or FVTT formats.",
            },
            {
                name: "Beautiful Assets",
                description:
                    "Utilizes assets from Forgotten Adventures for stunning visuals.",
            },
            {
                name: "Advanced Settings",
                description:
                    "Customize how climate and season affect map variables.",
            },
        ],
    },
    {
        title: "Calendar",
        description:
            "A note-taking tool preloaded with various fantasy calendars for event management.",
        icon: Calendar, // Lucide Calendar icon
        link: "/features#calendar",
        underConstruction: true,
        content: [
            {
                name: "Preloaded Calendars",
                description:
                    "Includes various fantasy calendars for customization.",
            },
            {
                name: "Event Management",
                description:
                    "Add events or reminders displayed to GMs and players.",
            },
            {
                name: "Reminders",
                description: "Set reminders for important in-game events.",
            },
        ],
    },
    {
        title: "Encounter Generator",
        description:
            "Create balanced combat and non-combat encounters tailored to your campaign's environment.",
        icon: MapPin, // Lucide MapPin icon as a substitute for EncounterIcon
        link: "/features#encounter-generator",
        underConstruction: false,
        content: [
            {
                name: "Biome & Climate",
                description:
                    "Generate encounters based on biome, climate, and season.",
            },
            {
                name: "Adjustable Probabilities",
                description:
                    "Customize encounter probabilities in the settings.",
            },
            {
                name: "Party Balancing",
                description:
                    "Save different parties with various levels and sizes for balanced encounters.",
            },
            {
                name: "Sequential Encounters",
                description:
                    "Generate sequential encounters for different variables.",
            },
        ],
    },
    {
        title: "Magic Shop Generator",
        description:
            "Create population-based magic shops with customizable filters and settings.",
        icon: ShoppingBag, // Lucide ShoppingBag icon
        link: "/features#magic-shop-generator",
        underConstruction: false,
        content: [
            {
                name: "City Preloads",
                description:
                    "Includes various Forgotten Realms cities and allows adding your own.",
            },
            {
                name: "Wealth & Magic Settings",
                description:
                    "Set the wealth and 'magic-ness' for each city to influence shop generation.",
            },
            {
                name: "Pricing Customization",
                description:
                    "Adjust starting prices and item quantities based on population settings.",
            },
            {
                name: "Book & Item Filters",
                description:
                    "Filter available books and items to tailor the shop inventory.",
            },
        ],
    },
    {
        title: "NPC Generator",
        description:
            "Generate diverse NPCs with detailed personalities, backgrounds, and appearances.",
        icon: User, // Lucide User icon
        link: "/features#npc-generator",
        underConstruction: false,
        content: [
            {
                name: "Diverse Representation",
                description: "Supports LGBTQ+ NPCs for inclusive storytelling.",
            },
            {
                name: "Detailed Personalities",
                description:
                    "Generates unique personalities and backgrounds based on D&D 5e.",
            },
            {
                name: "Physical Appearance",
                description:
                    "Creates comprehensive physical descriptions for each NPC.",
            },
        ],
    },
    {
        title: "Spellbook Generator",
        description:
            "Randomly generate spellbooks tailored to a wizard's level and subclass.",
        icon: BookOpen, // Lucide BookOpen icon
        link: "/features#spellbook-generator",
        underConstruction: false,
        content: [
            {
                name: "Level-Based Spells",
                description:
                    "Generates spells appropriate to the wizard's level.",
            },
            {
                name: "Subclass Specific",
                description:
                    "Tailors spellbooks based on the wizard's subclass.",
            },
            {
                name: "Randomization",
                description: "Ensures each spellbook is unique and varied.",
            },
        ],
    },
    {
        title: "System Generator",
        description:
            "Coming soon! A fully 3D galaxy map for sci-fi or Spelljammer campaigns.",
        icon: Globe, // Lucide Globe icon as a substitute for SystemIcon
        link: "/features#system-generator",
        underConstruction: true,
        content: [
            {
                name: "3D Galaxy Map",
                description:
                    "Zoomable from galaxy scale down to individual worlds.",
            },
            {
                name: "Spelljammer Support",
                description:
                    "Ideal for Spelljammer campaigns with detailed celestial bodies.",
            },
            {
                name: "Future Features",
                description: "Stay tuned for more exciting functionalities!",
            },
        ],
    },
    {
        title: "World Generator",
        description:
            "Create and manage expansive 3D hex sphere worlds with dynamic party tracking.",
        icon: Hexagon, // Lucide Hexagon icon
        link: "/features#world-generator",
        underConstruction: true,
        content: [
            {
                name: "3D Hex Sphere Map",
                description:
                    "Beautifully rendered hex tiles using Goldberg polyhedra.",
            },
            {
                name: "Party Tracking",
                description:
                    "Track multiple parties with individual time instances and random encounters.",
            },
            {
                name: "Preloaded Worlds",
                description:
                    "Includes several well-known fantasy worlds or generate your own.",
            },
            {
                name: "Community Seeds",
                description:
                    "Share and use seeds with the community for diverse world generation.",
            },
            {
                name: "Automated Processes",
                description:
                    "Automatic time advancement, encounter rolling, and battle map generation.",
            },
            {
                name: "Day & Night Cycles",
                description:
                    "Simulated using Babylon.js for immersive gameplay.",
            },
            {
                name: "Custom Hex Tiles",
                description:
                    "Add your own hex tile sets by creating pull requests.",
            },
        ],
    },
];
