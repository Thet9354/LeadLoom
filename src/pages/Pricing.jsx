import PricingSection from "../components/PricingSection";

export default function Pricing({ session }) {
    return (
        <main className="pt-24 mt-4 bg-white dark:bg-gray-950 min-h-screen transition-colors">
            <PricingSection session={session} />
        </main>
    );
}
