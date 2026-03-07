import { ArrowRight, InboxIcon, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-gray-950 transition-colors">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -left-10 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-primary text-sm font-medium mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                        Seamless Gmail to Notion Sync
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
                    >
                        Turn Your Inbox Into Your Most <span className="text-primary relative inline-block">Organized<svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 dark:text-blue-800" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" /></svg></span> Sales Team
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Stop letting leads die in your unread folder. Instantly sync emails into actionable Notion databases and track every conversation effortlessly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <a
                            href="https://calendly.com/thetpine254/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                        >
                            Start 14-Day Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <a
                            href="#demo"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg font-medium py-4 px-8 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1"
                        >
                            Watch LeadLoom in Action
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-4 text-sm text-gray-500 dark:text-gray-500 font-medium"
                    >
                        14-day free trial • Card required to activate sync
                    </motion.p>
                </div>

                {/* Abstract Hero Image / Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 6, y: [0, -10, 0] }}
                    transition={{
                        duration: 1,
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        rotateX: { duration: 1, delay: 0.2 }
                    }}
                    whileHover={{ rotateX: 0, scale: 1.02, transition: { duration: 0.5 } }}
                    className="mt-20 relative mx-auto max-w-5xl perspective-1000 origin-bottom"
                >
                    <div className="relative rounded-2xl lg:rounded-[2rem] bg-gray-900/5 dark:bg-white/5 p-2 lg:p-4 backdrop-blur-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl transition-transform duration-700 ease-out">
                        <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col md:flex-row relative">

                            {/* Glowing overlay effect that moves across the board */}
                            <motion.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 dark:via-blue-500/10 to-transparent skew-x-12 z-50 pointer-events-none"
                            />

                            {/* Fake Gmail UI segment */}
                            <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-6 flex flex-col z-10">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                    <InboxIcon className="w-6 h-6 text-red-500" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">New Inquiries</span>
                                </div>

                                <div className="space-y-3 relative">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 + (i * 0.15) }}
                                            whileHover={{ scale: 1.02, backgroundColor: "var(--tw-prose-bg, rgba(59, 130, 246, 0.05))" }}
                                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 relative z-10 cursor-default"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                                                {['JD', 'AS', 'MR'][i - 1]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm text-gray-900 dark:text-white">{['John Doe', 'Alice Smith', 'Mark Ryan'][i - 1]}</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">10:4{i} AM</span>
                                                </div>
                                                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium truncate">Interested in Enterprise Plan</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">We'd like to schedule a call to discuss...</p>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Decorative curved syncing line */}
                                    <svg className="absolute top-1/2 -right-8 w-24 h-12 text-primary z-20 hidden md:block overflow-visible" style={{ transform: 'translateY(-50%)' }} fill="none" viewBox="0 0 100 50">
                                        <motion.path
                                            d="M0,25 Q50,25 100,25"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                            animate={{ strokeDashoffset: [0, -20] }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <motion.circle
                                            cx="50" cy="25" r="4"
                                            fill="currentColor"
                                            animate={{ cx: [0, 100] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="shadow-[0_0_10px_3px_rgba(59,130,246,0.6)]"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Fake Notion UI segment */}
                            <div className="w-full md:w-7/12 bg-white dark:bg-gray-900 p-6 flex flex-col z-10">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                    <Database className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">CRM Database</span>
                                    <div className="ml-auto flex gap-2">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">Filter</span>
                                        <span className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors rounded text-xs text-white font-medium shadow-[0_0_10px_2px_rgba(59,130,246,0.3)]">New</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                                <th className="pb-3 font-medium">Name</th>
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium">Action Needed</th>
                                                <th className="pb-3 font-medium text-right">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700 dark:text-gray-300">
                                            {[
                                                { n: 'John Doe', s: 'New Lead', a: 'Reply within 24h', v: '$5,000', c: 'blue' },
                                                { n: 'Alice Smith', s: 'Contacted', a: 'Schedule Demo', v: '$2,500', c: 'amber' },
                                                { n: 'Mark Ryan', s: 'Meeting Booked', a: 'Prep Pitch', v: '$10,000', c: 'green' }
                                            ].map((row, i) => (
                                                <motion.tr
                                                    key={i}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: 1.2 + (i * 0.15) }}
                                                    whileHover={{ backgroundColor: "var(--tw-prose-bg, rgba(156, 163, 175, 0.05))" }}
                                                    className="border-b border-gray-50 dark:border-gray-800 cursor-default"
                                                >
                                                    <td className="py-4 font-medium flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                                                            <span className={`w-2 h-2 rounded-sm ${i === 0 ? 'bg-primary animate-pulse' : 'bg-gray-200 dark:bg-gray-600'}`}></span>
                                                        </span>
                                                        {row.n}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${row.c}-100 dark:bg-${row.c}-900/30 text-${row.c}-700 dark:text-${row.c}-400`}>{row.s}</span>
                                                    </td>
                                                    <td className="py-4 text-gray-500 dark:text-gray-400">{row.a}</td>
                                                    <td className="py-4 text-right font-medium">{row.v}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
