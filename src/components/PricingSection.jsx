import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from '../config';

export default function PricingSection({ session }) {
    const navigate = useNavigate();

    const handlePaidPlanClick = async (plan) => {
        if (!session) {
            navigate("/login?mode=signup");
            return;
        }
        // Pro: redirect to dashboard for card activation step
        if (plan === "pro") {
            navigate("/dashboard?activate=pro");
            return;
        }
        // Plus: trigger Stripe checkout immediately
        try {
            const response = await fetch(`${API_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, plan })
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else console.error("Checkout failed:", data.error);
        } catch (error) {
            console.error("Checkout Error:", error);
        }
    };

    const tiers = [
        {
            name: "Starter",
            price: "$0",
            description: "Get started with automatic Gmail-to-Notion sync.",
            features: [
                "Up to 30 lead syncs/month",
                "1 Notion Database",
                "Standard Auto-Replies",
                "Community Support",
            ],
            cta: "Get Started Free",
            highlighted: false,
        },
        {
            name: "Plus",
            price: "$19",
            period: "/mo",
            description: "For growing teams that need more volume.",
            features: [
                "Up to 100 lead syncs/month",
                "Multiple Notion Databases",
                "Custom Auto-Reply Rules",
                "Email Support",
            ],
            cta: "Subscribe Now",
            ctaPlan: "plus",
            highlighted: false,
        },
        {
            name: "Pro",
            price: "$49",
            period: "/mo",
            description: "For teams serious about squashing lead leak.",
            features: [
                "Unlimited lead syncs",
                "Multiple Notion Integrations",
                "AI-Powered Hooks (Gemini)",
                "3-Day Ghost Watch Automations",
                "Priority Email Support",
            ],
            cta: "Start 14-Day Free Trial",
            ctaPlan: "pro",
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
            ctaLink: "mailto:leadloomsg@gmail.com",
            highlighted: false,
        }
    ];

    const renderCTA = (tier) => {
        const baseHighlighted = "bg-primary hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5";
        const baseDefault = "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700";
        const cls = `block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${tier.highlighted ? baseHighlighted : baseDefault}`;

        // Enterprise — always mailto
        if (tier.ctaLink) {
            return (
                <a href={tier.ctaLink} className={cls}>
                    {tier.cta}
                </a>
            );
        }

        // Starter — redirect to login or dashboard
        if (tier.name === "Starter") {
            return (
                <Link to={session ? "/dashboard" : "/login"} className={cls}>
                    {tier.cta}
                </Link>
            );
        }

        // Plus / Pro — auth-aware checkout
        return (
            <button onClick={() => handlePaidPlanClick(tier.ctaPlan)} className={cls + " cursor-pointer"}>
                {tier.cta}
            </button>
        );
    };

    return (
        <section id="pricing" className="py-24 bg-white dark:bg-gray-950 scroll-mt-10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                        Simple Pricing. No Surprises.
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Stop losing thousands to lead leak for less than the cost of a daily coffee.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
                    {tiers.map((tier, index) => (
                        <div
                            key={index}
                            className={`relative bg-white dark:bg-gray-900 rounded-3xl p-7 flex flex-col ${tier.highlighted
                                ? "border-2 border-primary shadow-2xl lg:-translate-y-2"
                                : "border border-gray-200 dark:border-gray-800 shadow-sm"
                                }`}
                        >
                            {tier.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    {tier.badge}
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{tier.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm leading-relaxed min-h-[40px]">{tier.description}</p>

                            <div className="mb-6 flex items-end gap-1">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{tier.price}</span>
                                {tier.period && <span className="text-gray-500 dark:text-gray-400 font-medium mb-0.5 text-sm">{tier.period}</span>}
                            </div>

                            <ul className="space-y-3 mb-7 flex-1">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {renderCTA(tier)}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
