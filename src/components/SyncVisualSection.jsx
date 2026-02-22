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
        handleScroll(); // Check on mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="sync-visual" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        See the <span className="text-primary">Magic in Action</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        A frictionless flow of information from your inbox to your Notion workspace.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8">

                    {/* Email Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full md:w-5/12 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 z-10"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="bg-red-100 p-2 rounded-lg text-red-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-gray-800">Gmail Inbox</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-gray-900">Sarah Jenkins</span>
                                <span className="text-xs text-gray-500">Just now</span>
                            </div>
                            <p className="text-sm font-medium text-gray-800 mb-1">Ready to upgrade to Pro</p>
                            <p className="text-xs text-gray-600 line-clamp-3">Hi there, we loved the trial and want to move forward with the Pro plan for our team. Could you send the payment link?</p>

                            <motion.div
                                initial={{ left: "-100%" }}
                                animate={inView ? { left: "100%" } : { left: "-100%" }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
                            />
                        </div>
                    </motion.div>

                    {/* Sync Badge */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                        className="hidden md:flex flex-col items-center justify-center z-20 absolute left-1/2 -translate-x-1/2"
                    >
                        <div className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 mb-2">
                            <RefreshCw className="w-4 h-4 animate-spin-slow" />
                            INSTANT SYNC
                        </div>
                        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent absolute top-1/2 -translate-y-1/2 -z-10" />
                    </motion.div>

                    {/* Sync Badge for Mobile */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                        className="md:hidden flex flex-col items-center justify-center z-20 my-[-2rem]"
                    >
                        <div className="bg-primary text-white p-3 rounded-full shadow-xl flex items-center justify-center">
                            <RefreshCw className="w-6 h-6 animate-spin-slow" />
                        </div>
                    </motion.div>

                    {/* Notion Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="w-full md:w-5/12 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 z-10"
                    >
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="bg-gray-100 p-2 rounded-lg text-gray-800 border border-gray-200">
                                <Database className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-gray-800">Notion Workspace</span>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-green-50/50 rounded-lg p-3 border border-green-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">SJ</div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Sarah Jenkins</p>
                                        <p className="text-xs text-gray-500">Ready to upgrade to Pro</p>
                                    </div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-medium">Closing</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-500">
                            <span>Database: Sales Pipeline</span>
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Updated
                            </span>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
