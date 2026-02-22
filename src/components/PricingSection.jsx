import { Check } from "lucide-react";

export default function PricingSection() {
    const tiers = [
        {
            name: "Starter",
            price: "$0",
            description: "Perfect for exploring the Notion-native sync.",
            features: [
                "Up to 50 email syncs/month",
                "1 Notion Database Integration",
                "Standard Auto-Replies",
                "Community Support",
            ],
            cta: "Get Started Free",
            highlighted: false,
        },
        {
            name: "Pro",
            price: "$49",
            period: "/mo",
            description: "For teams serious about squashing lead leak.",
            features: [
                "Unlimited email syncs",
                "Multiple Notion Integrations",
                "Custom Rules & Auto-Replies",
                "3-Day Ghost Watch Automations",
                "Priority Email Support",
            ],
            cta: "Start 14-Day Free Trial",
            highlighted: true,
            badge: "MOST POPULAR",
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Advanced workflows for high-volume agencies.",
            features: [
                "Dedicated Account Manager",
                "Custom API Integrations",
                "Advanced Analytics & Reporting",
                "Custom SLA",
                "White-glove data migration",
            ],
            cta: "Contact Sales",
            highlighted: false,
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-white scroll-mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                        Simple Pricing. No Surprises.
                    </h2>
                    <p className="text-xl text-gray-600">
                        Stop losing thousands to lead leak for less than the cost of a daily coffee.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-3xl p-8 ${tier.highlighted
                                ? "border-2 border-primary shadow-2xl transform md:-translate-y-4"
                                : "border border-gray-200 shadow-sm"
                                }`}
                        >
                            {tier.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    {tier.badge}
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                            <p className="text-gray-500 mb-6 h-12 leading-relaxed">{tier.description}</p>

                            <div className="mb-8 flex items-end gap-1">
                                <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{tier.price}</span>
                                {tier.period && <span className="text-gray-500 font-medium mb-1">{tier.period}</span>}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={tier.name === "Enterprise" ? "mailto:leadloomsg@gmail.com" : "https://calendly.com/thetpine254/30min"}
                                target="_blank"
                                rel="noreferrer"
                                className={`block w-full text-center py-4 rounded-xl font-bold transition-all duration-200 ${tier.highlighted
                                    ? "bg-primary hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5"
                                    : "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
                                    }`}
                            >
                                {tier.cta}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
