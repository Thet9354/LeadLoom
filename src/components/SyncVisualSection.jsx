import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, RefreshCw, Database } from "lucide-react";

export default function SyncVisualSection() {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const section = document.getElementById("sync-visual");
            if (section) {
                const top = section.getBoundingClientRect().top;
                if (top < window.innerHeight * 0.75) {
                    setInView(true);
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="sync-visual" className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors relative">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        See the <span className="text-primary">Magic in Action</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        A frictionless flow of information from your inbox to your Notion workspace.
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 mt-12">

                    {/* Flowing background connector line */}
                    <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 border-t-2 border-dashed border-gray-300 dark:border-gray-700 -z-10" />

                    {/* Email Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full md:w-5/12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-1 shadow-2xl z-10 relative overflow-hidden group"
                    >
                        {/* Animated Gradient Border Layer */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-[100%] z-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: 'conic-gradient(from 0deg, transparent 0 340deg, rgba(59, 130, 246, 0.4) 360deg)' }}
                        />

                        <div className="bg-white dark:bg-gray-800 rounded-[1.4rem] p-6 h-full relative z-10 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg text-red-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Gmail Inbox</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700 relative overflow-hidden shadow-inner">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">Sarah Jenkins</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
                                </div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Ready to upgrade to Pro</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">Hi there, we loved the trial and want to move forward with the Pro plan for our team. Could you send the payment link?</p>

                                {/* Continuous Scanning Light */}
                                <motion.div
                                    initial={{ left: "-100%" }}
                                    animate={inView ? { left: "200%" } : { left: "-100%" }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/80 dark:via-blue-400/20 to-transparent skew-x-12"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Sync Badge */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 150 }}
                        className="hidden md:flex flex-col items-center justify-center z-20 absolute left-1/2 -translate-x-1/2"
                    >
                        {/* Outer Pulse Rings */}
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary/30 rounded-full z-0 blur-md"
                            />
                            <motion.div
                                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-primary/20 rounded-full z-0 blur-lg"
                            />

                            <div className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_0_20px_5px_rgba(59,130,246,0.4)] flex items-center gap-2 relative z-10 border border-blue-400/50">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                    <RefreshCw className="w-4 h-4" />
                                </motion.div>
                                INSTANT SYNC
                            </div>
                        </div>
                    </motion.div>

                    {/* Sync Badge for Mobile */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                        className="md:hidden flex flex-col items-center justify-center z-20 my-[-2rem] relative"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-primary/40 rounded-full blur-sm"
                        />
                        <div className="bg-primary text-white p-3 rounded-full shadow-xl flex items-center justify-center relative z-10">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                <RefreshCw className="w-6 h-6" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Notion Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full md:w-5/12 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-1 shadow-2xl z-10 relative overflow-hidden group"
                    >
                        {/* Animated Gradient Border Layer */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-[100%] z-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ background: 'conic-gradient(from 0deg, transparent 0 340deg, rgba(34, 197, 94, 0.4) 360deg)' }}
                        />

                        <div className="bg-white dark:bg-gray-800 rounded-[1.4rem] p-6 h-full relative z-10 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                                    <Database className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Notion Workspace</span>
                            </div>

                            <div className="space-y-3 relative">
                                {/* Success Flash Background behind the item */}
                                <motion.div
                                    animate={{
                                        backgroundColor: ["rgba(34, 197, 94, 0)", "rgba(34, 197, 94, 0.15)", "rgba(34, 197, 94, 0)"],
                                        scale: [1, 1.02, 1]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.25 }}
                                    className="absolute -inset-2 rounded-xl -z-10"
                                />

                                <div className="bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-green-900/10 rounded-lg p-3 border border-green-200 dark:border-green-800/50 flex items-center justify-between shadow-sm relative overflow-hidden">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-gray-800">SJ</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">Sarah Jenkins</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Ready to upgrade to Pro</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-semibold border border-green-200 dark:border-green-800 z-10">Closing</span>

                                    {/* Arrival Scan line */}
                                    <motion.div
                                        animate={{ left: ["-100%", "200%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-green-400/20 dark:via-green-400/10 to-transparent skew-x-12 z-0"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>Database: Sales Pipeline</span>
                                <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                                    <motion.span
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"
                                    ></motion.span>
                                    Updated
                                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
