import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Share2, ShieldCheck, Users, SearchX, Zap, Layers, Network, FolderSync, CheckCircle2 } from "lucide-react";

export default function Agencies() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-28 min-h-screen pb-20">
            {/* 1. Hero Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 md:mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-8 border border-emerald-100 dark:border-emerald-800/50"
                >
                    <Sparkles size={16} />
                    <span>LeadLoom for Agencies</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight max-w-4xl mx-auto"
                >
                    The automated AI inbound engine for <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                        boutique digital teams
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10"
                >
                    Teams deserve a shared brain. LeadLoom automatically syncs the "hello@" inbox into Notion so your entire team knows exactly who said what.
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
                    <h3 className="text-emerald-500 font-semibold tracking-wider uppercase text-sm mb-3">Why Agencies Struggle</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Shared inboxes create shared chaos
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        When multiple people manage inbound leads, context gets lost. Account managers duplicate work, and leads stay unassigned.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The "Did you reply?" trap</h4>
                        <p className="text-gray-600 dark:text-gray-400">Team members constantly ping each other trying to figure out who owns which lead in the catch-all inbox.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                            <SearchX size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lost Hand-offs</h4>
                        <p className="text-gray-600 dark:text-gray-400">When sales passes a lead to fulfillment, the email history is buried. Crucial project details get completely lost in transit.</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-50 dark:bg-[#11131a] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                            <Share2 size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Expensive CRMs</h4>
                        <p className="text-gray-600 dark:text-gray-400">Small agencies pay thousands for Salesforce or HubSpot just for shared visibility, abandoning the Notion boards they love.</p>
                    </motion.div>
                </div>
            </div>

            {/* 3. The Solution Section */}
            <div className="py-24 bg-gray-50 dark:bg-[#0a0c10] border-y border-gray-100 dark:border-gray-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
                        <div className="order-2 lg:order-1 relative h-[400px] bg-white dark:bg-[#11131a] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/5 to-teal-500/5" />
                            <div className="relative z-10 w-full max-w-sm p-6 space-y-4">
                                {/* Mock UI Card 1 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Layers size={20} /></div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">Agency Leads Pipeline</div>
                                        <div className="text-xs text-gray-500">Shared Workspace updated</div>
                                    </div>
                                </motion.div>

                                <div className="flex justify-center">
                                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
                                </div>

                                {/* Mock UI Card 2 */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between border-l-4 border-l-blue-500"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 font-bold text-blue-600 text-xs flex items-center justify-center">MB</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Assigned to <span className="text-blue-500">Mark B.</span></div>
                                    </div>
                                    <div className="text-xs text-emerald-500 font-bold flex gap-1 items-center"><CheckCircle2 size={12} />Synced</div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <h3 className="text-emerald-500 font-semibold tracking-wider uppercase text-sm mb-3">Powered by LeadLoom</h3>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Centralize your deal flow automatically
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Connect your agency's shared inbox directly to your Notion CRM. The entire team gets real-time visibility without leaving their workspace.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                                        <FolderSync size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Centralized Workspace</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Every reply, from every team member, logs automatically to the lead's Notion card.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Network size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Automated Custom Mapping</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Map high-ticket project scopes and budgets directly to Notion properties.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Unlimited Notion Users</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">No per-seat pricing. Bring the whole fulfillment team into the loop for free.</p>
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
                    <h3 className="text-emerald-500 font-semibold tracking-wider uppercase text-sm mb-3">With LeadLoom</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        Results that matter
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Team Alignment", desc: "Sales and fulfillment look at the exact same data in real-time." },
                        { title: "No Missed Quotes", desc: "The 3-Day Ghost Watch ensures you always follow up on sent proposals." },
                        { title: "Zero Seat Licenses", desc: "Save thousands a year by utilizing Notion instead of bloated CRM software." },
                        { title: "Flawless Handoffs", desc: "Complete historical email context stays pinned to the client profile forever." },
                    ].map((item, i) => (
                        <div key={i} className="border-l-2 border-emerald-500/20 pl-6 hover:border-emerald-500 transition-colors">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. Quickstart / Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10">
                <div className="bg-emerald-50 dark:bg-[#11131a] border border-emerald-100 dark:border-white/5 rounded-[2rem] p-10 md:p-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">LeadLoom plugs easily into your stack</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                        Connect your shared Gmail. Select your Notion Pipeline. Watch the magic happen.
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
