import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Activity, Network, ArrowRight, Zap, Target, Lock } from "lucide-react";

export default function Features() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-28 pb-16 min-h-screen">
            {/* Header Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800">
                        <Sparkles size={16} />
                        <span>The Notion-Native Edge</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-8 tracking-tight"
                >
                    Powerful Features to <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                        Supercharge Your Sales
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
                >
                    Everything you need to turn your inbox into an automated prospect-closing powerhouse, perfectly synced with Notion.
                </motion.p>
            </div>

            {/* The Bento Grid Feature Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]">

                    {/* Feature 1: Intelligent Thread Parsing (Spans 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-2 relative group bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-primary">
                                    <BrainCircuit size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Intelligent Thread Parsing</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
                                    LeadLoom doesn't just copy raw text. It understands email context, separating signatures, history, and the actual reply so your Notion CRM stays incredibly clean.
                                </p>
                            </div>

                            {/* Decorative Mock Code Block */}
                            <div className="mt-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-xl p-4 font-mono text-sm text-gray-500 hidden sm:block">
                                <span className="text-blue-500">const</span> <span className="text-purple-500">intent</span> = <span className="text-blue-400">analyzeThread</span>(incomingEmail);<br />
                                <span className="text-blue-500">if</span> (intent === <span className="text-green-500">'interested'</span>) {'{'}<br />
                                &nbsp;&nbsp;notion.pages.update({'{'} status: <span className="text-green-500">'Hot Lead'</span> {'}'});<br />
                                {'}'}
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Custom Mapping */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="relative group bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-indigo-500">
                                <Network size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Custom Mapping</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg flex-grow">
                                Map standard email fields straight to your custom properties in Notion. Names, companies, budgets—routed perfectly.
                            </p>
                            <div className="flex items-center gap-2 text-indigo-500 font-medium text-sm mt-4 cursor-pointer group-hover:text-indigo-400 transition-colors">
                                Explore mappings <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 3: Smart Auto-Replies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="relative group bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-amber-500">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Instant Responses</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-lg flex-grow">
                                Acknowledge every prospect immediately while you prepare a personalized reply behind the scenes.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 4: 3-Day Ghost Watch (Spans 2 columns) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="md:col-span-2 relative group bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-red-500/30 dark:hover:border-red-500/50 transition-colors"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 mb-6 text-red-500">
                                    <Activity size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">3-Day Ghost Watch™ Engine</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
                                    If a lead hasn't replied to your initial email in 72 hours, LeadLoom automatically updates their status to "Needs Follow Up" directly inside your Notion database.
                                </p>
                            </div>

                            {/* Decorative Progress Bar Graphic */}
                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-2 flex-grow bg-white dark:bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: "75%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                                    />
                                </div>
                                <span className="font-mono text-sm text-red-500 font-bold whitespace-nowrap">72hr Timer Active</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Deep Dive Section 1: The Sync Architecture */}
            <div className="py-24 border-t border-gray-100 dark:border-gray-900 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-2xl flex items-center justify-center mb-6">
                                <Target size={28} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                Flawless bi-directional synchronization.
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                Why context-switch? Every time an email hits your inbox or a prospect replies, the exact content, sender details, and timeline are pushed instantly into your dedicated Notion workspace.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time pushing via Webhooks",
                                    "Zero manual data entry required",
                                    "Supports unlimited Notion databases",
                                    "Enterprise-grade reliability"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Interactive Widget visualization */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-30"></div>
                            <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-2xl h-[400px] flex items-center justify-center overflow-hidden group">

                                {/* Connection Animation */}
                                <div className="flex items-center justify-center gap-8 relative z-10 w-full px-8">
                                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 z-20 hover:scale-105 transition-transform cursor-pointer">
                                        <svg className="w-12 h-12 text-[#EA4335]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
                                    </div>

                                    <div className="flex-grow h-1 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden flex items-center justify-center">
                                        {/* Animated dot moving back and forth */}
                                        <motion.div
                                            animate={{ x: ["-150%", "150%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="w-12 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                                        />
                                        <motion.div
                                            animate={{ x: ["150%", "-150%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.75, ease: "linear" }}
                                            className="w-12 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent absolute"
                                        />
                                    </div>

                                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0 z-20 hover:scale-105 transition-transform cursor-pointer">
                                        <span className="font-bold text-2xl text-gray-900 dark:text-white">N</span>
                                    </div>
                                </div>

                                {/* Floating decorative data particles */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [100, -400],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 3 + Math.random() * 2,
                                                delay: Math.random() * 2,
                                                ease: "linear",
                                            }}
                                            className="absolute left-[20%] w-32 h-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm"
                                            style={{ left: `${15 + (i * 15)}%`, bottom: "-50px" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Security Section (Trust marker) */}
            <div className="max-w-5xl mx-auto px-4 mt-16 pb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400"
                >
                    <Lock size={18} className="text-gray-400" />
                    <span>Bank-grade encryption. We never read or store your email passwords. OAuth 2.0 secured.</span>
                </motion.div>
            </div>

        </main>
    );
}
