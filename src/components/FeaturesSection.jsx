import { Zap, Clock, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Zap className="w-6 h-6 text-primary" />,
            title: "Instant Logging",
            description: "Incoming emails from prospects automatically create a new row in your Notion CRM database. No manual setup required.",
        },
        {
            icon: <Clock className="w-6 h-6 text-primary" />,
            title: "Smart Auto-Replies",
            description: "Acknowledge every prospect immediately. Send targeted auto-replies based on the email content while you prepare to follow up.",
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-primary" />,
            title: "3-Day Ghost Watch",
            description: "If a lead hasn't replied to your initial email in 3 days, LeadLoom automatically moves their status to 'needs follow up' in Notion.",
        }
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        The Solution: <span className="text-primary">The Notion-Native Edge</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Automate the busywork so you can focus on closing deals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 bg-blue-50 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
