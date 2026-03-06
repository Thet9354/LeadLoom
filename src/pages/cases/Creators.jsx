import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, MailWarning, Gift, Zap, MessageSquare, Play, Video, Target, CheckCircle2 } from "lucide-react";

export default function Creators() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-28 min-h-screen pb-20">
            {/* 1. Hero Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-semibold mb-8 border border-pink-100 dark:border-pink-800/50"
                >
                    <Sparkles size={16} />
                    <span>LeadLoom for Creators</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight max-w-4xl mx-auto"
                >
                    The fast, automated inbound engine for <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
                        monetizing your audience
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    A creator's inbox is a battlefield. LeadLoom automatically sorts sponsorships from fan mail, routing the money directly to your CRM.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/signup"
                        className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        Setup in 5 mins
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                        href="mailto:leadloomsg@gmail.com"
                        className="w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                        Talk to founder
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </a>
                </motion.div>
            </div>

            {/* 2. The Problem Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h3 className="text-pink-500 font-semibold tracking-wider uppercase text-sm mb-3">Why Creators Struggle</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Sponsorships buried in spam
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        When you go viral, your inbox breaks. Genuine brand deals sit unread next to newsletter spam and audience questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Missed Brand Deals</h4>
                        <p className="text-gray-600 dark:text-gray-400">A $5,000 integration offer from a top-tier software company gets buried under 200 automated PR pitches.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                            <MailWarning size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The Fake "Agent"</h4>
                        <p className="text-gray-600 dark:text-gray-400">You act as your own manager, trying to sound professional in negotiations while juggling video editing and content scripts.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <MessageSquare size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Support Ticket Hell</h4>
                        <p className="text-gray-600 dark:text-gray-400">If you sell courses or digital products, handling password resets and refund requests takes away from creative time.</p>
                    </motion.div>
                </div>
            </div>

            {/* 3. The Solution Section */}
            <div className="py-24 bg-gray-50 dark:bg-[#0a0c10] border-y border-gray-100 dark:border-gray-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <div className="order-2 lg:order-1 relative h-[400px] bg-white dark:bg-[#11131a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-rose-500/5" />
                            <div className="relative z-10 w-full max-w-sm p-6 space-y-4">
                                {/* Mock UI Card 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 font-bold text-pink-600 text-xs flex items-center justify-center">BD</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Brand Deal Detect</div>
                                    </div>
                                    <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                        "We'd love to sponsor a 60-second integration..."
                                    </div>
                                </motion.div>

                                <div className="flex justify-center flex-col items-center">
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                                    <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">ROUTED TO NOTION</div>
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                                </div>

                                {/* Mock UI Card 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 font-bold text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Media Kit Auto-Sent</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h3 className="text-pink-500 font-semibold tracking-wider uppercase text-sm mb-3">Powered by LeadLoom</h3>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                The ultimate brand deal sorter
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Give your creativity room to breathe. LeadLoom acts as your 24/7 digital manager, identifying real opportunities and ignoring the noise.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 flex items-center justify-center shrink-0">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Intent Recognition</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically tags inbound emails as "Sponsorships", "Collabs", or "Support".</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center shrink-0">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Media Kit Automation</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Send your rate card and stats instantly when a qualified brand reaches out.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                                        <Gift size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Product Support Deflection</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Route course-buyers to your helpdesk without muddying your sponsorship inbox.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h3 className="text-pink-500 font-semibold tracking-wider uppercase text-sm mb-3">With LeadLoom</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Results that matter
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Zero Inbox Anxiety", desc: "Open your Notion board to see 5 clean brand deals instead of 500 messy emails." },
                        { title: "Higher Rates", desc: "Brands respect creators who reply instantly with a professional package." },
                        { title: "Never Drop the Ball", desc: "Track \"Contract Sent\" vs \"Payment Pending\" sponsorships visually." },
                        { title: "More Creation Time", desc: "Spend hours making videos instead of sifting through PR pitches." },
                    ].map((item, i) => (
                        <div key={i} className="border-l-2 border-pink-500/20 pl-6 hover:border-pink-500 transition-colors">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Quickstart / Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10">
                <div className="bg-pink-50 dark:bg-[#11131a] border border-pink-100 dark:border-white/5 rounded-[2rem] p-10 md:p-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">LeadLoom plugs easily into your stack</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                        Connect your business email. Select your Notion Sponsor Board. Watch the magic happen.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        Setup in 5 mins
                        <ArrowRight size={18} />
                    </Link>
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <ShieldCheck size={16} />
                        <span>OAuth 2.0 secured. We never read your passwords.</span>
                    </div>
                </div>
            </div>

        </main>
    );
}
