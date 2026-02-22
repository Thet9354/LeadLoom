import { Users, PhoneCall, Sparkles } from "lucide-react";

export default function BetaSection() {
    return (
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm text-primary font-bold mb-6">
                    <Sparkles className="w-4 h-4" />
                    Exclusive Opportunity
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                    Join Our Founding Beta
                </h2>

                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    We are currently looking for <span className="font-bold text-gray-900 border-b-2 border-primary">5 founding members</span> to help shape the future of LeadLoom. Lock in lifetime priority support and early access to new features.
                </p>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 mb-10 max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-16 h-16 bg-blue-100 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Founding Member Status</h3>
                            <p className="text-gray-600">Only 5 spots left</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-left">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <PhoneCall className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Free 15-Min Setup</h3>
                            <p className="text-gray-600">White-glove onboarding</p>
                        </div>
                    </div>
                </div>

                <a
                    href="https://calendly.com/thetpine254/leadloom-beta-program"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                    Claim Your Spot Now
                </a>
            </div>
        </section>
    );
}
