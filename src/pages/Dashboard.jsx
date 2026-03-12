import { useState, useEffect } from "react";
import { Database, AlertTriangle, CheckCircle, Mail, X, Save, AlertCircle, Zap, Crown, CreditCard, Lock, TrendingUp, Shield, Copy, ExternalLink, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { API_URL } from '../config';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];
const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];

const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        const end = parseInt(value, 10);
        if (isNaN(end)) return;
        if (end === 0) { setDisplayValue(0); return; }
        let start = 0;
        const duration = 1200;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setDisplayValue(end); clearInterval(timer); }
            else { setDisplayValue(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Intent classification from email domain
const getIntent = (email) => {
    if (!email || !email.includes("@")) return "Medium";
    const domain = email.split("@")[1]?.toLowerCase();
    if (PERSONAL_DOMAINS.includes(domain)) return "Medium";
    return "High";
};

const IntentPill = ({ intent }) => {
    const styles = {
        High: "bg-green-900/30 text-green-400 border-green-800/50",
        Medium: "bg-blue-900/30 text-blue-400 border-blue-800/50",
        Spam: "bg-red-900/30 text-red-400 border-red-800/50"
    };
    return (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${styles[intent] || styles.Medium}`}>
            {intent}
        </span>
    );
};

const PLAN_LIMITS = { starter: 30, plus: 100, pro: Infinity };
const CARD = "bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-xl";

export default function Dashboard({ session }) {
    const [syncLogs, setSyncLogs] = useState(() => {
        try { const c = localStorage.getItem(`ll_logs_${session?.user?.id || 'guest'}`); return c ? JSON.parse(c) : []; } catch { return []; }
    });
    const [userProfile, setUserProfile] = useState(() => {
        try { const c = localStorage.getItem(`ll_profile_${session?.user?.id || 'guest'}`); return c ? JSON.parse(c) : null; } catch { return null; }
    });
    const [dashboardStats, setDashboardStats] = useState(() => {
        try { const c = localStorage.getItem(`ll_stats_${session?.user?.id || 'guest'}`); return c ? JSON.parse(c) : null; } catch { return null; }
    });
    const [volumeData, setVolumeData] = useState(() => {
        try { const c = localStorage.getItem(`ll_volume_${session?.user?.id || 'guest'}`); return c ? JSON.parse(c) : null; } catch { return null; }
    });
    const [distributionData, setDistributionData] = useState(() => {
        try { const c = localStorage.getItem(`ll_dist_${session?.user?.id || 'guest'}`); return c ? JSON.parse(c) : null; } catch { return null; }
    });

    const [showConfigModal, setShowConfigModal] = useState(false);
    const [notionDbId, setNotionDbId] = useState("");
    const [notionApiKey, setNotionApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [timeRange, setTimeRange] = useState(7);
    const [selectedLead, setSelectedLead] = useState(null);
    const [copied, setCopied] = useState(false);

    const location = useLocation();

    const gmailConnected = !!userProfile?.gmail_connected;
    const notionConfigured = !!userProfile?.notion_configured;
    const planType = userProfile?.plan_type || "starter";
    const planLimit = PLAN_LIMITS[planType] || 30;
    const syncCount = userProfile?.current_month_sync_count || 0;
    const limitReached = planType !== "pro" && syncCount >= planLimit;
    const cardActivated = planType !== "starter";
    const setupComplete = gmailConnected && notionConfigured && cardActivated;

    let daysRemaining = 14;
    let trialExpired = false;
    if (planType === "pro" && userProfile?.trial_start) {
        const diff = Math.floor((Date.now() - new Date(userProfile.trial_start).getTime()) / 86400000);
        daysRemaining = Math.max(0, 14 - diff);
        trialExpired = daysRemaining <= 0;
    }

    // URL param effects
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        if (error) { showToastMsg("error", "Gmail connection issue: " + decodeURIComponent(error)); window.history.replaceState({}, "", "/dashboard"); }
        const checkout = params.get("checkout");
        if (checkout === "success") { showToastMsg("success", "Payment successful!"); window.history.replaceState({}, "", "/dashboard"); }
        if (checkout === "canceled") { showToastMsg("error", "Checkout was canceled."); window.history.replaceState({}, "", "/dashboard"); }
        if (params.get("step") === "1" && params.get("success") === "true") { showToastMsg("success", "Gmail connected!"); window.history.replaceState({}, "", "/dashboard"); }
        if (params.get("activate") === "pro") { showToastMsg("success", "Complete setup below to start your 14-day trial."); window.history.replaceState({}, "", "/dashboard"); }
    }, [location.search]);

    const showToastMsg = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 5000); };

    // Data fetching
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchData = async () => {
            try {
                const logRes = await fetch(`${API_URL}/api/user/sync-logs?user_id=${session.user.id}`);
                const logData = await logRes.json();
                if (logData?.success && Array.isArray(logData?.data)) { setSyncLogs(logData.data); localStorage.setItem(`ll_logs_${session.user.id}`, JSON.stringify(logData.data)); }
                else setSyncLogs([]);
            } catch (err) { console.error("Sync logs fetch failed:", err); }

            try {
                const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const profData = await profRes.json();
                if (profData?.success) { setUserProfile(profData.data); localStorage.setItem(`ll_profile_${session.user.id}`, JSON.stringify(profData.data)); }
            } catch (err) { console.error("Profile fetch failed:", err); }

            try {
                const statsRes = await fetch(`${API_URL}/api/dashboard-stats?user_id=${session.user.id}`);
                const statsData = await statsRes.json();
                if (statsData?.success) { setDashboardStats(statsData.data); localStorage.setItem(`ll_stats_${session.user.id}`, JSON.stringify(statsData.data)); }
            } catch (err) { console.error("Stats fetch failed:", err); }
        };
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [session?.user?.id]);

    // Chart data — re-fetch when time range changes
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchCharts = async () => {
            try {
                const volRes = await fetch(`${API_URL}/api/analytics/volume?user_id=${session.user.id}&days=${timeRange}`);
                const volData = await volRes.json();
                if (volData?.success) { setVolumeData(volData.data); localStorage.setItem(`ll_volume_${session.user.id}`, JSON.stringify(volData.data)); }
            } catch (err) { console.error("Volume fetch failed:", err); }
            try {
                const distRes = await fetch(`${API_URL}/api/analytics/distribution?user_id=${session.user.id}&days=${timeRange}`);
                const distData = await distRes.json();
                if (distData?.success) { setDistributionData(distData.data); localStorage.setItem(`ll_dist_${session.user.id}`, JSON.stringify(distData.data)); }
            } catch (err) { console.error("Distribution fetch failed:", err); }
        };
        fetchCharts();
    }, [session?.user?.id, timeRange]);

    const handleGoogleConnect = () => { if (!session?.user?.id) return; window.location.href = `${API_URL}/auth/google?user_id=${session.user.id}`; };

    const handleSaveNotionConfig = async () => {
        if (!notionDbId) { showToastMsg("error", "Please enter a Notion Database ID."); return; }
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/user/notion-config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: session.user.id, notion_db_id: notionDbId, notion_api_key: notionApiKey || undefined }) });
            const data = await response.json();
            if (data.success) { setShowConfigModal(false); showToastMsg("success", "Notion database connected!"); const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`); const profData = await profRes.json(); if (profData?.success) setUserProfile(profData.data); }
            else { showToastMsg("error", "Failed to save: " + (data.error || "Unknown error")); }
        } catch (error) { showToastMsg("error", "Network error: " + error.message); }
        finally { setIsSaving(false); }
    };

    const handleUpgrade = async (plan = "pro") => {
        if (!session?.user?.id) return;
        try {
            const response = await fetch(`${API_URL}/create-checkout-session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: session.user.id, plan }) });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
        } catch (error) { console.error("Checkout Error:", error); }
    };

    const handleCopyEmail = (email) => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    const totalLeads = dashboardStats?.total_leads || 0;
    const leadsThisWeek = dashboardStats?.leads_this_week || 0;
    const highIntentPct = dashboardStats?.high_intent_pct;

    return (
        <main className="min-h-screen bg-[#030303] pt-24 pb-12 transition-colors">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: "Dashboard" }]} />

                {/* Toast */}
                {toast && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm ${toast.type === "success" ? "bg-green-900/30 text-green-300 border border-green-800" : "bg-red-900/30 text-red-300 border border-red-800"}`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100"><X size={16} /></button>
                    </div>
                )}

                {/* Sync Limit Banner */}
                {limitReached && (
                    <div className={`${CARD} p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div><p className="font-semibold text-white">Monthly limit reached</p><p className="text-sm text-gray-400">Upgrade to continue syncing leads.</p></div>
                        </div>
                        <button onClick={() => handleUpgrade("pro")} className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">Upgrade to Pro</button>
                    </div>
                )}

                {/* Trial Expired Banner */}
                {trialExpired && planType === "pro" && (
                    <div className={`${CARD} p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                        <div className="flex items-start gap-3">
                            <CreditCard size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                            <div><p className="font-semibold text-white">Pro trial expired</p><p className="text-sm text-gray-400">Subscribe to keep your pro features active.</p></div>
                        </div>
                        <button onClick={() => handleUpgrade("pro")} className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">Subscribe</button>
                    </div>
                )}

                {/* Plan Banner */}
                {!limitReached && !trialExpired && userProfile && (
                    <div className={`${CARD} p-5 mb-6 flex items-center justify-between`}>
                        <div>
                            <h4 className="flex items-center gap-2 font-bold text-white text-lg mb-0.5">
                                {planType === "pro" && <Crown size={18} className="text-emerald-500" />}
                                {planType === "plus" && <Zap size={18} className="text-blue-500" />}
                                {planType === "pro" ? "LeadLooms Pro" : planType === "plus" ? "LeadLooms Plus" : "Starter Plan"}
                                {planType !== "pro" && (
                                    <span className="text-sm font-semibold px-2 py-0.5 rounded bg-[#2563eb]/20 text-blue-400">{syncCount}/{planLimit} syncs</span>
                                )}
                            </h4>
                            <p className="text-sm text-gray-400">{planType === "pro" ? "Unlimited syncs — all features unlocked." : "Upgrade for more lead syncs and premium features."}</p>
                        </div>
                        {planType !== "pro" && (
                            <button onClick={() => handleUpgrade("pro")} className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">Upgrade to Pro</button>
                        )}
                    </div>
                )}

                {/* ============ COMMAND CENTER ============ */}
                <div className="flex flex-col gap-6">

                    {/* ===== TASK 2: ROI HERO STATS ===== */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Revenue Protected */}
                        <div className={`${CARD} p-5 flex flex-col justify-between h-[120px] group`}>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Protected</span>
                            <p className="text-3xl font-black text-[#10b981] tracking-tight" style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                                <AnimatedNumber value={totalLeads * 500} prefix="$" />
                            </p>
                        </div>

                        {/* AI Intent Score */}
                        <div className={`${CARD} p-5 flex flex-col justify-between h-[120px] group`}>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">AI Intent Score</span>
                            <p className="text-3xl font-black text-white tracking-tight">
                                {highIntentPct !== null && highIntentPct !== undefined ? (
                                    <><AnimatedNumber value={highIntentPct} suffix="%" /> <span className="text-sm font-semibold text-gray-400">High Intent</span></>
                                ) : (
                                    <span className="text-gray-500">—</span>
                                )}
                            </p>
                        </div>

                        {/* Lead Momentum */}
                        <div className={`${CARD} p-5 flex flex-col justify-between h-[120px] group`}>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">This Week</span>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-black text-white tracking-tight">
                                    <AnimatedNumber value={leadsThisWeek} />
                                </p>
                                <TrendingUp size={20} className="text-[#10b981]" />
                            </div>
                        </div>

                        {/* System Pulse */}
                        <div className={`${CARD} p-5 flex flex-col justify-between h-[120px] group`}>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">System Pulse</span>
                            <div className="flex items-center gap-2.5">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
                                </span>
                                <span className="text-lg font-bold text-white">Active & Secure</span>
                            </div>
                        </div>
                    </div>

                    {/* ===== TASK 3: ANALYTICS ENGINE ===== */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white">Analytics</h2>
                        <div className="flex items-center bg-[#111111] border border-[#222222] rounded-lg p-0.5">
                            {[7, 30, 90].map(d => (
                                <button key={d} onClick={() => setTimeRange(d)} className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${timeRange === d ? 'bg-[#2563eb] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                                    {d}D
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Area Chart */}
                        <div className={`lg:col-span-2 ${CARD} p-5 flex flex-col h-[340px]`}>
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-white">Lead Momentum</h3>
                                <p className="text-xs text-gray-500">Synced inbound activity over the last {timeRange} days.</p>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={volumeData || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11, fill: '#555' }} tickLine={false} axisLine={false} tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} minTickGap={25} />
                                        <YAxis stroke="#555" tick={{ fontSize: 11, fill: '#555' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#333', borderRadius: '10px', color: '#fff', fontSize: '13px' }} itemStyle={{ color: '#fff', fontWeight: 600 }} cursor={{ stroke: '#333', strokeDasharray: '4 4' }} />
                                        <Area type="monotone" dataKey="leads" name="Leads" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} animationDuration={1200} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <div className={`${CARD} p-5 flex flex-col h-[340px] relative overflow-hidden`}>
                            <div>
                                <h3 className="text-sm font-semibold text-white">Source Distribution</h3>
                                <p className="text-xs text-gray-500">Business vs Personal ratios.</p>
                            </div>
                            <div className="flex-1 w-full min-h-0 flex items-center justify-center mt-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={distributionData || []} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1200} cornerRadius={3}>
                                            {(distributionData || []).map((entry, i) => (<Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#111111', borderColor: '#333', borderRadius: '10px', color: '#fff', fontSize: '13px' }} itemStyle={{ color: '#fff', fontWeight: 600 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-center pb-1">
                                {(distributionData || []).map((entry, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span>{entry.name} ({entry.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ===== TASK 4 & 5: INTELLIGENCE FEED + HEALTH ===== */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Intelligence Feed */}
                        <div className={`lg:col-span-2 ${CARD} overflow-hidden flex flex-col min-h-[420px]`}>
                            <div className="p-5 border-b border-[#222222]">
                                <h3 className="text-sm font-semibold text-white">Intelligence Feed</h3>
                                <p className="text-xs text-gray-500">Real-time inbound lead activity.</p>
                            </div>
                            {(limitReached || trialExpired) ? (
                                <div className="p-8 text-center text-gray-500 my-auto">
                                    <AlertTriangle size={28} className="mx-auto mb-3 opacity-50" />
                                    <p className="text-sm">Syncing is paused. Upgrade to resume.</p>
                                </div>
                            ) : syncLogs && syncLogs.length > 0 ? (
                                <ul className="flex-1 divide-y divide-[#1a1a1a] overflow-y-auto">
                                    {syncLogs.map(log => {
                                        const date = new Date(log.sync_time);
                                        const now = new Date();
                                        const diffMs = now - date;
                                        const diffMins = Math.floor(diffMs / 60000);
                                        const diffHours = Math.floor(diffMins / 60);
                                        const diffDays = Math.floor(diffHours / 24);
                                        const timeAgo = diffDays > 0 ? `${diffDays}d ago` : diffHours > 0 ? `${diffHours}h ago` : diffMins > 0 ? `${diffMins}m ago` : "just now";
                                        const intent = getIntent(log.lead_email);
                                        const initials = log.lead_email ? log.lead_email.substring(0, 2).toUpperCase() : "??";

                                        return (
                                            <li key={log.id} onClick={() => setSelectedLead(log)} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                                <div className="w-9 h-9 rounded-full bg-[#2563eb]/15 border border-[#2563eb]/30 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-medium text-white truncate block">{log.lead_email}</span>
                                                </div>
                                                <IntentPill intent={intent} />
                                                <span className="text-xs text-gray-600 whitespace-nowrap hidden sm:block">{timeAgo}</span>
                                                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-gray-500 my-auto">
                                    <p className="text-sm">No sync activity yet.</p>
                                </div>
                            )}
                        </div>

                        {/* ===== TASK 5: HEALTH SIDEBAR ===== */}
                        <div className={`${CARD} p-5 h-fit`}>
                            <h3 className="text-sm font-semibold text-white mb-5">Integration Health</h3>
                            <div className="space-y-5">
                                {/* Gmail Step */}
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${gmailConnected ? 'bg-[#10b981]/15 border border-[#10b981]/40' : 'bg-red-500/15 border border-red-500/40'}`}>
                                            {gmailConnected ? (
                                                <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <X className="w-4 h-4 text-red-500" strokeWidth="3" />
                                            )}
                                        </div>
                                        <div className={`w-px h-6 ${gmailConnected ? 'bg-[#10b981]/30' : 'bg-red-500/30'}`}></div>
                                    </div>
                                    <div className="pt-1 flex-1">
                                        <p className={`text-sm font-medium ${gmailConnected ? 'text-[#10b981]' : 'text-red-400'}`}>Gmail {gmailConnected ? "Connected" : "Disconnected"}</p>
                                        {!gmailConnected ? (
                                            <button onClick={handleGoogleConnect} className="mt-2 text-xs bg-[#2563eb] hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg transition-all font-semibold">Reconnect</button>
                                        ) : (
                                            <button onClick={handleGoogleConnect} className="mt-1 text-xs text-gray-500 hover:text-white transition-colors underline">Reconnect</button>
                                        )}
                                    </div>
                                </div>

                                {/* Notion Step */}
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notionConfigured ? 'bg-[#10b981]/15 border border-[#10b981]/40' : 'bg-red-500/15 border border-red-500/40'}`}>
                                            {notionConfigured ? (
                                                <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <X className="w-4 h-4 text-red-500" strokeWidth="3" />
                                            )}
                                        </div>
                                        <div className={`w-px h-6 ${notionConfigured ? 'bg-[#10b981]/30' : 'bg-red-500/30'}`}></div>
                                    </div>
                                    <div className="pt-1 flex-1">
                                        <p className={`text-sm font-medium ${notionConfigured ? 'text-[#10b981]' : 'text-red-400'}`}>Notion {notionConfigured ? "Linked" : "Disconnected"}</p>
                                        {!notionConfigured ? (
                                            <button onClick={() => setShowConfigModal(true)} className="mt-2 text-xs bg-[#2563eb] hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg transition-all font-semibold">Link Notion</button>
                                        ) : (
                                            <button onClick={() => setShowConfigModal(true)} className="mt-1 text-xs text-gray-500 hover:text-white transition-colors underline">Change</button>
                                        )}
                                    </div>
                                </div>

                                {/* System Status Step */}
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#10b981]/15 border border-[#10b981]/40">
                                            <Shield size={14} className="text-[#10b981]" />
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm font-medium text-[#10b981]">API Online</p>
                                        <p className="text-xs text-gray-500 mt-0.5">All systems operational.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== SLIDE-OVER PANEL (Task 4) ===== */}
            <AnimatePresence>
                {selectedLead && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setSelectedLead(null)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-[#222222] z-50 flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-[#222222] flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Lead Detail</h3>
                                <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                {/* Email */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium text-sm flex-1 truncate">{selectedLead.lead_email}</span>
                                        <button onClick={() => handleCopyEmail(selectedLead.lead_email)} className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors bg-[#111111] border border-[#222222] rounded-lg px-3 py-1.5">
                                            <Copy size={12} />
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Intent */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Intent Classification</label>
                                    <IntentPill intent={getIntent(selectedLead.lead_email)} />
                                </div>

                                {/* Synced At */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Synced At</label>
                                    <p className="text-sm text-gray-300">{new Date(selectedLead.sync_time).toLocaleString()}</p>
                                </div>

                                {/* Notion Link */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">Notion</label>
                                    <a href={selectedLead.notion_page_url || `https://notion.so`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:text-blue-400 transition-colors">
                                        <ExternalLink size={14} />
                                        Open in Notion
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ===== CONFIG MODAL ===== */}
            {showConfigModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0a0a] rounded-2xl border border-[#222222] shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><Database size={20} className="text-[#2563eb]" /> Connect Notion</h3>
                        <p className="text-sm text-gray-500 mb-5">Enter your Notion Database ID to start syncing leads.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Database ID <span className="text-red-500">*</span></label>
                                <input type="text" value={notionDbId} onChange={(e) => setNotionDbId(e.target.value)} placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j" className="w-full border border-[#333] bg-[#111111] text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all" autoFocus />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">API Key <span className="text-gray-600">(optional)</span></label>
                                <input type="password" value={notionApiKey} onChange={(e) => setNotionApiKey(e.target.value)} placeholder="secret_..." className="w-full border border-[#333] bg-[#111111] text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all" />
                            </div>
                            <button onClick={handleSaveNotionConfig} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save size={16} /> {isSaving ? "Saving..." : "Save & Connect"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
