/** @format */

// app/page.tsx
import DonateSection from "@/components/donate/DonateSection";
import Hero from "@/components/landing/Hero";
import dynamic from "next/dynamic";

const FeaturesSection = dynamic(() => import("@/components/landing/Features"));
const PricingSection = dynamic(() => import("@/components/landing/Pricing"));
const FAQ = dynamic(() => import("@/components/landing/FAQ"));

export default function Home() {
    return (
        <div>
            <Hero />
            <FeaturesSection />
            <PricingSection />
            <DonateSection />
            <FAQ />
        </div>
    );
}
