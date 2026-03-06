import FeaturesSection from "../components/FeaturesSection";
import SyncVisualSection from "../components/SyncVisualSection";
import HowItWorksSection from "../components/HowItWorksSection";

export default function Features() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                    Powerful Features to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Supercharge Your Sales</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    Everything you need to turn your inbox into an automated prospect-closing powerhouse, perfectly synced with Notion.
                </p>
            </div>

            {/* Reusing existing sections for the detailed features view */}
            <div className="space-y-12">
                <FeaturesSection />
                <div className="py-12 bg-gray-50 dark:bg-gray-900/50">
                    <SyncVisualSection />
                </div>
                <HowItWorksSection />
            </div>
        </main>
    );
}
