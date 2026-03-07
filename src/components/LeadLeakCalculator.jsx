import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Calculator, Hourglass, Ghost, CircleDollarSign } from "lucide-react";

export default function LeadLeakCalculator() {
    const [leadsPerMonth, setLeadsPerMonth] = useState(100);
    const [leadValue, setLeadValue] = useState(1000);
    const controls = useAnimation();

    // Assuming a 15% missing/delay rate
    const missedRate = 0.15;
    const lostRevenue = Math.round(leadsPerMonth * missedRate * leadValue);

    // Trigger a pop animation whenever the lost revenue value changes
    useEffect(() => {
        controls.start({
            scale: [1, 1.15, 1],
            color: ["#ef4444", "#f87171", "#ef4444"], // Red shades
            transition: { duration: 0.3 }
        });
    }, [lostRevenue, controls]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        The Problem: <span className="text-red-500 relative">
                            The Lead Leak
                            <motion.svg animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -bottom-2 left-0 w-full h-2 text-red-500 top-full pointer-events-none" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray="5,5" /></motion.svg>
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Every missed or delayed reply is money gone. See how much your manual process is costing you.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Calculator Inputs */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                    >
                        {/* Background glow effects */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-100 dark:bg-red-900/40 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-60 blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-50 dark:bg-orange-900/20 rounded-full opacity-60 blur-3xl"></div>

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Calculate Your Leak</h3>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium text-gray-700 dark:text-gray-300">Monthly Leads</label>
                                    <span className="font-bold text-primary">{leadsPerMonth}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={leadsPerMonth}
                                    onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-transform"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium text-gray-700 dark:text-gray-300">Average Value Per Lead</label>
                                    <span className="font-bold text-primary">${leadValue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="10000"
                                    step="100"
                                    value={leadValue}
                                    onChange={(e) => setLeadValue(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95 transition-transform"
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 text-center border border-red-100 dark:border-red-800 shadow-inner group transition-all hover:bg-red-100/50 dark:hover:bg-red-900/30">
                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">Potential Lost Revenue</p>
                                    <motion.p
                                        animate={controls}
                                        className="text-5xl font-extrabold text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] origin-center"
                                    >
                                        ${lostRevenue.toLocaleString()}
                                    </motion.p>
                                    <p className="text-xs text-red-400 dark:text-red-500 mt-2 font-medium">Per month based on a 15% drop-off rate</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Value Props / Problem Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
                    >
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, x: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px -3px rgba(249, 115, 22, 0.15)" }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 transition-all duration-300"
                        >
                            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-xl flex-shrink-0 shadow-inner">
                                <Hourglass className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Manual Entry</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Copy-pasting from Gmail to Notion wastes hours of productive sales time every week.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, x: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 transition-all duration-300"
                        >
                            <div className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl flex-shrink-0 shadow-inner">
                                <Ghost className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Leads Ghost You</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">If you don't reply within 5 minutes, your chance of qualifying a lead drops by 80%.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={cardVariants}
                            whileHover={{ scale: 1.02, x: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px -3px rgba(239, 68, 68, 0.15)" }}
                            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 transition-all duration-300"
                        >
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-xl flex-shrink-0 shadow-inner">
                                <CircleDollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Lost Deals</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Every untracked email thread is a potential deal slipping through the cracks.</p>
                            </div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
