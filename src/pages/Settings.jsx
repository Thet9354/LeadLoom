import { useState, useEffect } from "react";
import { Mail, Database, CheckCircle, Save, AlertCircle, Shield, Monitor, Smartphone, LogOut, Sparkles, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { API_URL } from '../config';
import { supabase } from '../supabaseClient';

const TABS = [
    { id: "general", label: "General" },
    { id: "dna", label: "Brand DNA" },
];

const TONE_PREVIEWS = {
    Professional: "Thank you for reaching out. We'd love to explore how we can add value to your operations.",
    Friendly: "Hey there! So glad you got in touch — let's chat about how we can help you out! 😊",
    Casual: "Yo! Cool that you're checking us out. Let's jump on a call and figure this out together.",
    Bold: "You came to the right place. Let's cut to the chase and get your team set up ASAP.",
    Empathetic: "I completely understand the challenges you're facing. We're here to make things easier for you.",
    Direct: "Here's the deal: we solve exactly this problem. Let's connect this week.",
};

export default function SettingsPage({ session }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("general");

    // General tab state
    const [notionDbId, setNotionDbId] = useState("");
    const [notionApiKey, setNotionApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [gmailConnected, setGmailConnected] = useState(false);
    const [currentDevice, setCurrentDevice] = useState({ os: "Loading...", browser: "", location: "Fetching location..." });
    const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);

    // Brand DNA state
    const [dna, setDna] = useState({
        business_name: "", business_description: "", industry: "",
        target_lead: "", target_company_size: "",
        tone: "Professional", keywords: "",
        cta_link: "", cta_label: "",
    });
    const [dnaLoaded, setDnaLoaded] = useState(false);
    const [dnaSaving, setDnaSaving] = useState(false);
    const [resetting, setResetting] = useState(false);

    const updateDna = (key, value) => setDna(prev => ({ ...prev, [key]: value }));

    useEffect(() => {
        const ua = navigator.userAgent;
        let os = "Unknown OS";
        let browser = "Unknown Browser";
        if (ua.includes("Mac OS")) os = "macOS";
        else if (ua.includes("Windows")) os = "Windows";
        else if (ua.includes("Linux")) os = "Linux";
        else if (ua.includes("Android")) os = "Android";
        else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";
        setCurrentDevice(prev => ({ ...prev, os, browser }));
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.city && data.ip) setCurrentDevice(prev => ({ ...prev, location: `${data.city}, ${data.country} • ${data.ip}` }));
                else setCurrentDevice(prev => ({ ...prev, location: "Location Unavailable" }));
            })
            .catch(() => setCurrentDevice(prev => ({ ...prev, location: "Local Network" })));
    }, []);

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const data = await res.json();
                if (data?.success && data?.data) {
                    setGmailConnected(!!data.data.gmail_connected);
                    if (data.data.onboarding_data && typeof data.data.onboarding_data === "object") {
                        setDna(prev => ({ ...prev, ...data.data.onboarding_data }));
                    }
                    setDnaLoaded(true);
                }
            } catch (err) {
                console.error("Failed to fetch config:", err);
            }
        };
        fetchConfig();
    }, [session?.user?.id]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSaveNotionConfig = async () => {
        if (!notionDbId) { showToast("error", "Please enter a Notion Database ID."); return; }
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/user/notion-config`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, notion_db_id: notionDbId, notion_api_key: notionApiKey || undefined }),
            });
            const data = await response.json();
            data.success ? showToast("success", "Settings saved successfully!") : showToast("error", "Failed to save: " + (data.error || "Unknown error"));
        } catch (error) { showToast("error", "Network error: " + error.message); }
        finally { setIsSaving(false); }
    };

    const handleSignOutOthers = async () => {
        setIsSigningOutOthers(true);
        try {
            const { error } = await supabase.auth.signOut({ scope: 'others' });
            if (error) throw error;
            showToast("success", "Successfully logged out of all other devices.");
        } catch (error) { showToast("error", "Failed to sign out other devices: " + error.message); }
        finally { setIsSigningOutOthers(false); }
    };

    const handleGoogleConnect = () => {
        if (!session?.user?.id) return;
        window.location.href = `${API_URL}/auth/google?user_id=${session.user.id}`;
    };

    const handleSaveDNA = async () => {
        setDnaSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/user/onboarding`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, onboarding_data: dna }),
            });
            const data = await res.json();
            if (data.success) {
                // Simulate calibration delay
                await new Promise(r => setTimeout(r, 1500));
                showToast("success", "Brand DNA updated! Your AI is now recalibrated.");
            } else {
                showToast("error", "Failed to save: " + (data.error || "Unknown error"));
            }
        } catch (err) { showToast("error", "Network error: " + err.message); }
        finally { setDnaSaving(false); }
    };

    const handleResetOnboarding = async () => {
        if (!window.confirm("This will reset your onboarding and redirect you to the setup flow. Continue?")) return;
        setResetting(true);
        try {
            await fetch(`${API_URL}/api/user/toggle-automation`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, onboarding_complete: false }),
            });
            // Clear onboarding_data
            await fetch(`${API_URL}/api/user/onboarding`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, onboarding_data: null }),
            });
            navigate("/onboarding", { replace: true });
        } catch (err) { showToast("error", "Reset failed: " + err.message); }
        finally { setResetting(false); }
    };

    const INPUT = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm text-sm";
    const CARD = "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6";

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 transition-colors">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: "Settings" }]} />
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Account Settings</h1>

                {/* Tab Navigation */}
                <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                            {tab.id === "dna" && <Sparkles size={14} className="inline mr-1.5 -mt-0.5" />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm ${toast.type === "success"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                )}

                {/* =================== GENERAL TAB =================== */}
                {activeTab === "general" && (
                    <div className="space-y-6">
                        {/* Gmail */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1"><Mail size={20} className="text-red-500" /> Gmail Connection</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage the Gmail account linked to LeadLoom.</p>
                            {gmailConnected ? (
                                <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium text-sm"><CheckCircle className="w-4 h-4 mr-1.5" /> Connected</span>
                            ) : (
                                <button onClick={handleGoogleConnect} className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2 px-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                                    <Mail className="w-5 h-5 text-red-500" /> Connect with Google
                                </button>
                            )}
                        </div>

                        {/* Notion */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1"><Database size={20} className="text-blue-500" /> Lead Configuration</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update the Notion database where your leads are synced.</p>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notion Database ID <span className="text-red-500">*</span></label>
                                    <input type="text" value={notionDbId} onChange={e => setNotionDbId(e.target.value)} placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j" className={INPUT} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notion API Key <span className="text-gray-400">(optional)</span></label>
                                    <input type="password" value={notionApiKey} onChange={e => setNotionApiKey(e.target.value)} placeholder="secret_..." className={INPUT} />
                                </div>
                                <button onClick={handleSaveNotionConfig} disabled={isSaving} className="w-fit flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Save size={16} /> {isSaving ? "Saving..." : "Save Settings"}
                                </button>
                            </div>
                        </div>

                        {/* Security */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1"><Shield size={20} className="text-purple-500" /> Security & Devices</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your active sessions and log out of unrecognized devices.</p>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                        <div className="mt-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                                            {currentDevice.os === "iOS" || currentDevice.os === "Android" ? <Smartphone size={20} className="text-gray-600 dark:text-gray-300" /> : <Monitor size={20} className="text-gray-600 dark:text-gray-300" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                {currentDevice.os} • {currentDevice.browser}
                                                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">Current Device</span>
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{currentDevice.location}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                    <div className="flex items-start gap-4 mb-4 sm:mb-0 opacity-75">
                                        <div className="mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-full shadow-sm"><Monitor size={20} className="text-gray-500 dark:text-gray-400" /></div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">Other Active Devices</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Remote sessions linked to your account</p>
                                        </div>
                                    </div>
                                    <button onClick={handleSignOutOthers} disabled={isSigningOutOthers} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50">
                                        <LogOut size={16} /> {isSigningOutOthers ? "Signing out..." : "Sign Out"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== BRAND DNA TAB =================== */}
                {activeTab === "dna" && (
                    <div className="space-y-6">
                        {/* Business Identity */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1"><Sparkles size={20} className="text-blue-500" /> Business Identity</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your brand details for AI-powered lead classification.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
                                    <input value={dna.business_name} onChange={e => updateDna("business_name", e.target.value)} placeholder="e.g. LeadLooms" className={INPUT} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">What does your business do?</label>
                                    <textarea value={dna.business_description} onChange={e => updateDna("business_description", e.target.value)} placeholder="e.g. We help solopreneurs automate lead capture from Gmail to Notion using AI." rows={3} className={`${INPUT} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                    <input value={dna.industry} onChange={e => updateDna("industry", e.target.value)} placeholder="e.g. SaaS, E-commerce, Consulting" className={INPUT} />
                                </div>
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">🎯 Target Audience</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Describe your ideal customer so the AI can better classify leads.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ideal Lead Profile</label>
                                    <textarea value={dna.target_lead} onChange={e => updateDna("target_lead", e.target.value)} placeholder="e.g. Small business owners looking for CRM automation" rows={3} className={`${INPUT} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Company Size</label>
                                    <select value={dna.target_company_size} onChange={e => updateDna("target_company_size", e.target.value)} className={`${INPUT} appearance-none cursor-pointer`}>
                                        <option value="">Select...</option>
                                        <option value="Solo / Freelancer">Solo / Freelancer</option>
                                        <option value="1-10 employees">1-10 employees</option>
                                        <option value="11-50 employees">11-50 employees</option>
                                        <option value="51-200 employees">51-200 employees</option>
                                        <option value="200+ employees">200+ employees</option>
                                        <option value="Any size">Any size</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Voice & Tone */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">🗣️ Voice & Tone</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set the communication style for AI-generated hooks.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.keys(TONE_PREVIEWS).map(t => (
                                            <button key={t} onClick={() => updateDna("tone", t)}
                                                className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${dna.tone === t
                                                    ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-white'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Live Tone Preview */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Live Tone Preview</p>
                                    <p className={`text-sm leading-relaxed transition-all ${dna.tone === "Bold" ? "text-gray-900 dark:text-white font-bold" :
                                        dna.tone === "Casual" ? "text-gray-600 dark:text-gray-300 italic" :
                                            dna.tone === "Friendly" ? "text-blue-600 dark:text-blue-400" :
                                                dna.tone === "Empathetic" ? "text-purple-600 dark:text-purple-400" :
                                                    dna.tone === "Direct" ? "text-gray-900 dark:text-white font-semibold" :
                                                        "text-gray-700 dark:text-gray-300"
                                        }`}>
                                        "{TONE_PREVIEWS[dna.tone] || TONE_PREVIEWS.Professional}"
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Keywords</label>
                                    <input value={dna.keywords} onChange={e => updateDna("keywords", e.target.value)} placeholder="e.g. automation, efficiency, growth, AI-powered" className={INPUT} />
                                </div>
                            </div>
                        </div>

                        {/* Primary CTA */}
                        <div className={CARD}>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1"><ExternalLink size={20} className="text-emerald-500" /> Primary Call-to-Action</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This link will be included in AI-generated reply hooks.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Link</label>
                                    <input value={dna.cta_link} onChange={e => updateDna("cta_link", e.target.value)} placeholder="e.g. https://calendly.com/your-name" className={INPUT} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Label</label>
                                    <input value={dna.cta_label} onChange={e => updateDna("cta_label", e.target.value)} placeholder="e.g. Book a Demo, Get Started" className={INPUT} />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button onClick={handleSaveDNA} disabled={dnaSaving} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            {dnaSaving ? <><Loader2 size={16} className="animate-spin" /> Recalibrating AI Engine...</> : <><Save size={16} /> Save Changes</>}
                        </button>

                        {/* Danger Zone */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/50 p-6">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400 mb-1"><AlertTriangle size={20} /> Danger Zone</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Reset your Brand DNA and redo the onboarding experience from scratch.</p>
                            <button onClick={handleResetOnboarding} disabled={resetting}
                                className="flex items-center gap-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2 px-5 rounded-xl shadow-sm transition-all disabled:opacity-50">
                                {resetting ? "Resetting..." : "Reset Onboarding Experience"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
