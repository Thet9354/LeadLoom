import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Activity, Network, ArrowRight, Zap, Target, Lock, Mail } from "lucide-react";
import { SiGmail, SiNotion, SiSlack, SiApple, SiWhatsapp, SiSalesforce } from "react-icons/si";
import HowItWorksSection from "../components/HowItWorksSection";

export default function Features() {
    return (
        <main className="bg-white dark:bg-gray-950 transition-colors pt-28 min-h-screen">
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
                        className="md:col-span-2 relative group bg-gray-50 dark:bg-[#11131a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
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

                            {/* Visual Abstract Thread Processing instead of code block */}
                            <div className="mt-6 flex flex-col gap-3 relative z-10 hidden sm:flex max-w-md">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-grow space-y-1.5">
                                        <div className="h-2 w-32 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                                        <div className="h-2 w-20 bg-gray-100 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">Raw Data</span>
                                </motion.div>

                                <div className="w-0.5 h-4 bg-gray-200 dark:bg-gray-700 ml-8"></div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="bg-blue-50/80 dark:bg-primary/10 backdrop-blur-sm p-3.5 rounded-2xl border border-blue-100 dark:border-primary/30 shadow-sm flex items-center gap-4 ml-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                                        <Activity size={18} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                                            Intent Extracted: <span className="text-primary italic">"Interested"</span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Signatures & history ignored</div>
                                    </div>
                                </motion.div>
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
                        className="relative group bg-gray-50 dark:bg-[#11131a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
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
                        className="relative group bg-gray-50 dark:bg-[#11131a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-primary/30 dark:hover:border-primary/50 transition-colors"
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
                        className="md:col-span-2 relative group bg-gray-50 dark:bg-[#11131a] rounded-3xl p-8 border border-gray-100 dark:border-white/5 overflow-hidden hover:border-red-500/30 dark:hover:border-red-500/50 transition-colors"
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
                                <div className="h-2 flex-grow bg-gray-200 dark:bg-[#1f222e] rounded-full overflow-hidden">
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
            <div className="py-24 border-t border-gray-100 dark:border-gray-900 relative overflow-hidden bg-white dark:bg-[#0a0c10]">
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
                                Flawless bi-directional <br /><span className="bg-gray-100 dark:bg-[#202434] px-2 rounded-lg inline-block mt-2">synchronization.</span>
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
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Interactive Widget visualization - with Authentic SVG Icons */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-indigo-500/30 rounded-[2.5rem] blur-2xl opacity-40 dark:opacity-60"></div>
                            <div className="relative bg-[#0f111a] border border-gray-800/80 rounded-[2rem] p-8 shadow-2xl h-[420px] flex items-center justify-center overflow-hidden group">

                                {/* Connection Animation with SVGs */}
                                <div className="flex items-center justify-between relative z-10 w-full px-4 sm:px-12">
                                    {/* Gmail Authentic */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1a1d27] rounded-[1.75rem] shadow-xl shadow-black/40 border border-[#2a2f40] flex items-center justify-center shrink-0 z-20 hover:scale-[1.03] transition-transform cursor-pointer">
                                        <SiGmail className="w-12 h-12 sm:w-14 sm:h-14 text-[#EA4335]" />
                                    </div>

                                    {/* Data Line */}
                                    <div className="flex-grow h-1.5 bg-[#1a1d27] rounded-full mx-6 relative overflow-hidden flex items-center justify-center">
                                        {/* Animated dot moving back and forth */}
                                        <motion.div
                                            animate={{ x: ["-150%", "150%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            className="w-16 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                        />
                                        <motion.div
                                            animate={{ x: ["150%", "-150%"] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.75, ease: "linear" }}
                                            className="w-16 h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent absolute shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                                        />
                                    </div>

                                    {/* Notion Authentic */}
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1a1d27] rounded-[1.75rem] shadow-xl shadow-black/40 border border-[#2a2f40] flex items-center justify-center shrink-0 z-20 hover:scale-[1.03] transition-transform cursor-pointer">
                                        <SiNotion className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                                    </div>
                                </div>

                                {/* Floating decorative data particles */}
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                y: [150, -450],
                                                opacity: [0, 0.8, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 4 + Math.random() * 3,
                                                delay: Math.random() * 2,
                                                ease: "linear",
                                            }}
                                            className="absolute w-16 sm:w-24 h-8 bg-[#1a1d27]/60 backdrop-blur-md rounded border border-white/5 shadow-lg"
                                            style={{ left: `${15 + (i * 12)}%`, bottom: "-80px" }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Security Section (Trust marker) */}
                <div className="max-w-5xl mx-auto px-4 mt-20 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#11131a]/80 backdrop-blur border border-white/5 text-gray-400 text-sm sm:text-base font-medium"
                    >
                        <Lock size={16} className="text-gray-500" />
                        <span>Bank-grade encryption. We never read or store your email passwords. OAuth 2.0 secured.</span>
                    </motion.div>
                </div>
            </div>

            {/* How It Works Section (Imported Component) */}
            <div className="bg-white dark:bg-gray-950">
                <HowItWorksSection />
            </div>

            {/* Coming Soon Section (Sneak Peek) */}
            <div className="py-24 bg-gray-50 dark:bg-[#0a0c10] border-t border-gray-100 dark:border-gray-900 border-b relative overflow-hidden">
                {/* Background subtle radial gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
                                The ecosystem is expanding.
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                LeadLoom is growing beyond Gmail and Notion. We're actively building deep integrations for the tools your team already relies on.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Slack Integration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-[#11131a] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center group hover:border-[#E01E5A]/30 transition-colors shadow-sm"
                        >
                            <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700/50 group-hover:bg-[#E01E5A]/10 transition-colors">
                                <SiSlack className="w-8 h-8 text-gray-400 group-hover:text-[#E01E5A] transform group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Slack Alerts</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Push immediate lead updates to Slack channels.</p>
                        </motion.div>

                        {/* Apple Integration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-[#11131a] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center group hover:border-[#333333]/30 dark:hover:border-white/30 transition-colors shadow-sm"
                        >
                            <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700/50 group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors">
                                <SiApple className="w-8 h-8 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transform group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Apple iCloud Mail</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Native Apple ecosystem support.</p>
                        </motion.div>

                        {/* Salesforce Integration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-[#11131a] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center group hover:border-[#00A1E0]/30 transition-colors shadow-sm"
                        >
                            <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700/50 group-hover:bg-[#00A1E0]/10 transition-colors">
                                <SiSalesforce className="w-8 h-8 text-gray-400 group-hover:text-[#00A1E0] transform group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Salesforce</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise CRM bi-directional sync.</p>
                        </motion.div>

                        {/* WhatsApp Integration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-[#11131a] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center group hover:border-[#25D366]/30 transition-colors shadow-sm"
                        >
                            <div className="w-16 h-16 mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700/50 group-hover:bg-[#25D366]/10 transition-colors">
                                <SiWhatsapp className="w-8 h-8 text-gray-400 group-hover:text-[#25D366] transform group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">WhatsApp Business</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Capture queries from messaging apps.</p>
                        </motion.div>

                    </div>
                </div>
            </div>

        </main>
    );
}
