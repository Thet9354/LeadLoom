import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, MailWarning, Clock, Star, BrainCircuit, Activity, Zap, CheckCircle2 } from "lucide-react";

export default function Freelancers() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-28 min-h-screen pb-20">
            {/* 1. Hero Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-8 border border-purple-100 dark:border-purple-800/50"
                >
                    <Sparkles size={16} />
                    <span>LeadLoom for High-Ticket Freelancers</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight max-w-4xl mx-auto"
                >
                    The automated AI inbound engine for <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
                        closing premium clients
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Premium services deserve premium speed. Instantly acknowledge $10,000 inquiries and map their project specs directly to your Notion CRM.
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
                    <h3 className="text-purple-500 font-semibold tracking-wider uppercase text-sm mb-3">Why Freelancers Struggle</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Slow replies kill high-ticket deals
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        When a client wants a $10k website, speed to lead is everything. But if you're deep in Figma or VScode, that lead goes to your competitor.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Missed Deadlines</h4>
                        <p className="text-gray-600 dark:text-gray-400">Checking email interrupts deep work. Ignoring email costs you thousands of dollars in lost opportunities.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6">
                            <Star size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Looking Unprofessional</h4>
                        <p className="text-gray-600 dark:text-gray-400">Taking 24 hours to reply to a massive inquiry destroys confidence in your ability to deliver high-end service.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <MailWarning size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Manual Admin</h4>
                        <p className="text-gray-600 dark:text-gray-400">Copy-pasting project requirements from an email thread into your Notion project board is tedious busywork.</p>
                    </motion.div>
                </div>
            </div>

            {/* 3. The Solution Section */}
            <div className="py-24 bg-gray-50 dark:bg-[#0a0c10] border-y border-gray-100 dark:border-gray-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-purple-500 font-semibold tracking-wider uppercase text-sm mb-3">Powered by LeadLoom</h3>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Professional automation that scales your time
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Protect your deep work. LeadLoom instantly hooks inbound clients and organizes their spec requirements inside Notion flawlessly.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Instant Auto-Replies</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Send a tailored onboarding document or Calendly link the absolute second they hit your inbox.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                                        <BrainCircuit size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Intelligent Field Mapping</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Automatically extract budget scopes and deadlines from the email thread into Notion.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                                        <Activity size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">3-Day Ghost Watch</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Never forget to follow-up on a customized proposal after you send it.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract Visual representation of "The Engine" */}
                        <div className="relative h-[400px] bg-white dark:bg-[#11131a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                            <div className="relative z-10 w-full max-w-sm p-6 space-y-4">
                                {/* Mock UI Card 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 font-bold text-orange-600 text-xs flex items-center justify-center">$$</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">New Request: <span className="text-emerald-500 font-bold">$10k build</span></div>
                                    </div>
                                </motion.div>

                                <div className="flex justify-center">
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                                </div>

                                {/* Mock UI Card 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 font-bold text-green-600 flex items-center justify-center"><CheckCircle2 size={16} /></div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Onboarding PDF Sent</div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h3 className="text-purple-500 font-semibold tracking-wider uppercase text-sm mb-3">With LeadLoom</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Results that matter
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "High-End Experience", desc: "Clients feel valued instantly, protecting your premium brand positioning." },
                        { title: "Deep Work Safely", desc: "Close out of Gmail. You know the engine is working in the background." },
                        { title: "Perfect Organization", desc: "Your Notion board acts as the ultimate truth for active and dormant prospects." },
                        { title: "More Deals Closed", desc: "Simply following up efficiently guarantees a higher conversion rate on inbound." },
                    ].map((item, i) => (
                        <div key={i} className="border-l-2 border-purple-500/20 pl-6 hover:border-purple-500 transition-colors">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Quickstart / Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10">
                <div className="bg-purple-50 dark:bg-[#11131a] border border-purple-100 dark:border-white/5 rounded-[2rem] p-10 md:p-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">LeadLoom plugs easily into your stack</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                        Connect your Gmail. Select your Notion Pipeline. Watch the magic happen.
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
