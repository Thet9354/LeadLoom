import HeroSection from "../components/HeroSection";
import LeadLeakCalculator from "../components/LeadLeakCalculator";
import FeaturesSection from "../components/FeaturesSection";
import SyncVisualSection from "../components/SyncVisualSection";
import HowItWorksSection from "../components/HowItWorksSection";
import BetaSection from "../components/BetaSection";
import PricingSection from "../components/PricingSection";

export default function Home({ session }) {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors">
            <HeroSection />
            <LeadLeakCalculator />
            <FeaturesSection />
            <SyncVisualSection />
            <HowItWorksSection />
            <BetaSection />
            <PricingSection session={session} />
        </main>
    );
}
