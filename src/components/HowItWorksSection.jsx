import { Mail, ArrowRight, Share2 } from "lucide-react";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "1",
            icon: <Mail className="w-8 h-8 text-primary" />,
            title: "Connect Gmail",
            description: "One-click OAuth integration. We securely access your inbox to monitor new leads.",
        },
        {
            number: "2",
            icon: <Share2 className="w-8 h-8 text-primary" />,
            title: "Select Notion Database",
            description: "Choose your existing 'Leads' or 'CRM' database. We'll map the fields automatically.",
        },
        {
            number: "3",
            icon: <ArrowRight className="w-8 h-8 text-primary" />,
            title: "Go Live",
            description: "That's it! LeadLoom starts capturing, replying, and nurturing leads 24/7 on autopilot.",
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                        Get started in under 5 minutes. No coding, no complexity—just results.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gray-100 dark:bg-gray-800 -z-10">
                        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-100 dark:from-blue-900/30 via-primary to-blue-100 dark:to-blue-900/30 opacity-20"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-3xl border-2 border-primary/20 shadow-xl shadow-blue-500/10 flex items-center justify-center mb-8 relative z-10 group hover:border-primary transition-colors duration-300">
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                                        {step.number}
                                    </div>
                                    {step.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
