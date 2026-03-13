import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Building2, Target, MessageSquare, Link2, Check } from "lucide-react";
import { API_URL } from "../config";

const CARD = "bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-2xl";

const steps = [
    { id: 0, title: "Your Business", icon: Building2, subtitle: "Tell us about your company" },
    { id: 1, title: "Ideal Lead", icon: Target, subtitle: "Describe your dream customer" },
    { id: 2, title: "Communication", icon: MessageSquare, subtitle: "Set your brand voice" },
    { id: 3, title: "Call-to-Action", icon: Link2, subtitle: "Where should leads go?" },
];

const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function Onboarding({ session }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [saving, setSaving] = useState(false);

    // Guard: redirect to dashboard if onboarding already completed
    useEffect(() => {
        if (!session?.user?.id) return;
        const check = async () => {
            try {
                const res = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const data = await res.json();
                if (data?.data?.onboarding_data) {
                    navigate("/dashboard", { replace: true });
                }
            } catch (err) { /* ignore */ }
        };
        check();
    }, [session?.user?.id, navigate]);

    const [formData, setFormData] = useState({
        business_name: "",
        business_description: "",
        industry: "",
        target_lead: "",
        target_company_size: "",
        tone: "Professional",
        keywords: "",
        cta_link: "",
        cta_label: "",
    });

    const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
    const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

    const handleFinish = async () => {
        if (!session?.user?.id) return;
        setSaving(true);
        try {
            await fetch(`${API_URL}/api/user/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, onboarding_data: formData }),
            });
            navigate("/onboarding/success");
        } catch (err) {
            console.error("Onboarding save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const progress = ((step + 1) / steps.length) * 100;

    return (
        <main className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full px-4 py-1.5 mb-4">
                        <Sparkles size={14} className="text-[#2563eb]" />
                        <span className="text-xs font-semibold text-[#2563eb]">AI Brand DNA</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Set up your intelligence profile</h1>
                    <p className="text-sm text-gray-500">This helps our AI classify and respond to your leads accurately.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-[#10b981] text-white' : i === step ? 'bg-[#2563eb] text-white' : 'bg-[#1a1a1a] text-gray-600 border border-[#333]'}`}>
                                    {i < step ? <Check size={14} /> : i + 1}
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium hidden sm:block">{s.title}</span>
                            </div>
                        ))}
                    </div>
                    <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Step Card */}
                <div className={`${CARD} p-8 relative overflow-hidden min-h-[340px]`}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {step === 0 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Business Name</label>
                                        <input value={formData.business_name} onChange={e => update("business_name", e.target.value)} placeholder="e.g. LeadLooms" className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">What does your business do?</label>
                                        <textarea value={formData.business_description} onChange={e => update("business_description", e.target.value)} placeholder="e.g. We help solopreneurs automate lead capture from Gmail to Notion using AI." rows={3} className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600 resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Industry</label>
                                        <input value={formData.industry} onChange={e => update("industry", e.target.value)} placeholder="e.g. SaaS, E-commerce, Consulting" className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600" />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Describe your ideal lead</label>
                                        <textarea value={formData.target_lead} onChange={e => update("target_lead", e.target.value)} placeholder="e.g. Small business owners looking for CRM automation, agencies needing lead management tools." rows={3} className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600 resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Target company size</label>
                                        <select value={formData.target_company_size} onChange={e => update("target_company_size", e.target.value)} className="w-full bg-white/5 border border-[#333] text-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all appearance-none cursor-pointer">
                                            <option value="" className="bg-[#111]">Select...</option>
                                            <option value="Solo / Freelancer" className="bg-[#111]">Solo / Freelancer</option>
                                            <option value="1-10 employees" className="bg-[#111]">1-10 employees</option>
                                            <option value="11-50 employees" className="bg-[#111]">11-50 employees</option>
                                            <option value="51-200 employees" className="bg-[#111]">51-200 employees</option>
                                            <option value="200+ employees" className="bg-[#111]">200+ employees</option>
                                            <option value="Any size" className="bg-[#111]">Any size</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">Communication tone</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Professional", "Friendly", "Casual", "Bold"].map(t => (
                                                <button key={t} onClick={() => update("tone", t)} className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${formData.tone === t ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#2563eb]' : 'bg-white/5 border-[#333] text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Keywords your brand uses</label>
                                        <input value={formData.keywords} onChange={e => update("keywords", e.target.value)} placeholder="e.g. automation, efficiency, growth, AI-powered" className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600" />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Primary CTA link</label>
                                        <input value={formData.cta_link} onChange={e => update("cta_link", e.target.value)} placeholder="e.g. https://calendly.com/your-name" className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1.5">CTA button label</label>
                                        <input value={formData.cta_label} onChange={e => update("cta_label", e.target.value)} placeholder="e.g. Book a Demo, Get Started, Learn More" className="w-full bg-white/5 border border-[#333] text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all placeholder:text-gray-600" />
                                    </div>
                                    <div className="bg-[#2563eb]/5 border border-[#2563eb]/20 rounded-xl p-4 mt-2">
                                        <p className="text-xs text-[#2563eb] font-medium">This link will be included in AI-generated reply hooks when your leads are classified.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6">
                    <button onClick={goBack} disabled={step === 0} className={`flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-xl transition-all ${step === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white bg-[#111111] border border-[#222222] hover:border-gray-500'}`}>
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step < 3 ? (
                        <button onClick={goNext} className="flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button onClick={handleFinish} disabled={saving} className="flex items-center gap-2 text-sm font-semibold py-2.5 px-6 rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50">
                            {saving ? "Saving..." : <>Finish & Go to Dashboard <Sparkles size={16} /></>}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
