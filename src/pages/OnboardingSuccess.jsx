import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Bot } from "lucide-react";
import confetti from "canvas-confetti";
import { API_URL } from "../config";

const CARD = "bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-2xl";

export default function OnboardingSuccess({ session }) {
    const navigate = useNavigate();
    const hasFiredConfetti = useRef(false);
    const [aiPreview, setAiPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fire confetti on mount
    useEffect(() => {
        if (hasFiredConfetti.current) return;
        hasFiredConfetti.current = true;
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.4, x: 0.5 },
                colors: ['#2563eb', '#ffffff', '#06b6d4', '#93c5fd', '#10b981']
            });
        }, 100);
    }, []);

    // Fetch AI preview
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchPreview = async () => {
            setLoading(true);
            try {
                // Get the user's onboarding data from their profile
                const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const profData = await profRes.json();
                const onboardingData = profData?.data?.onboarding_data;

                if (!onboardingData) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`${API_URL}/api/test-onboarding-reply`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ onboarding_data: onboardingData }),
                });
                const data = await res.json();
                if (data.success) {
                    setAiPreview(data);
                }
            } catch (err) {
                console.error("AI Preview fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, [session?.user?.id]);

    const [entering, setEntering] = useState(false);

    const handleEnter = async () => {
        setEntering(true);
        // Persist onboarding_complete: true
        if (session?.user?.id) {
            try {
                await fetch(`${API_URL}/api/user/toggle-automation`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: session.user.id, enabled: false, onboarding_complete: true }),
                });
            } catch (err) { /* best-effort */ }
        }
        navigate("/dashboard", { replace: true });
    };

    return (
        <main className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles size={14} className="text-[#10b981]" />
                        <span className="text-xs font-semibold text-[#10b981]">Setup Complete</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Calibration Complete 🎯</h1>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">Your AI is now personalized to your brand. Here's a preview of how it will respond to incoming leads.</p>
                </motion.div>

                {/* AI Preview Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className={`${CARD} p-6 mb-6 hover:scale-[1.02] transition-transform duration-300`}
                >
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse"></div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI Preview</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-500">Generating AI response...</span>
                            </div>
                        </div>
                    ) : aiPreview ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Incoming Lead */}
                            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#1a1a1a]">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <User size={14} className="text-amber-400" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-white block">Incoming Lead</span>
                                        <span className="text-[10px] text-gray-600">test@company.com</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">{aiPreview.inquiry}</p>
                            </div>

                            {/* AI Reply */}
                            <div className="bg-[#2563eb]/5 rounded-xl p-4 border border-[#2563eb]/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-7 h-7 rounded-full bg-[#2563eb]/20 flex items-center justify-center">
                                        <Bot size={14} className="text-[#2563eb]" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-white block">AI Drafted Reply</span>
                                        <span className="text-[10px] text-[#2563eb]">Powered by your Brand DNA</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">{aiPreview.reply}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500">Preview unavailable. Your AI is still being configured.</p>
                        </div>
                    )}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-center"
                >
                    <button
                        onClick={handleEnter}
                        className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-sm py-3 px-8 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40"
                    >
                        Go to Dashboard <ArrowRight size={16} />
                    </button>
                    <p className="text-xs text-gray-600 mt-3">You can update your Brand DNA anytime from Settings.</p>
                </motion.div>
            </div>
        </main>
    );
}
