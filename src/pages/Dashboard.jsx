import { useState, useEffect, useCallback, useRef } from "react";
import { Database, AlertTriangle, CheckCircle, X, Save, AlertCircle, Zap, Crown, CreditCard, TrendingUp, Search, ChevronRight, ChevronDown, Loader2, Pencil } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Breadcrumb from "../components/Breadcrumb";
import LeadDetail, { getIntent, IntentPill } from "../components/LeadDetail";
import { API_URL } from '../config';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

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

// Summary tooltip for feed rows
const SummaryTooltip = ({ summary, children }) => {
    const [show, setShow] = useState(false);
    if (!summary) return children;
    return (
        <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show && (
                <div className="absolute left-0 bottom-full mb-2 z-30 w-72 bg-[#1a1a1a] border border-[#333] rounded-lg p-3 shadow-xl pointer-events-none">
                    <p className="text-xs text-gray-400 leading-relaxed">{summary}</p>
                </div>
            )}
        </div>
    );
};

const PLAN_LIMITS = { starter: 30, plus: 100, pro: Infinity };
const CARD = "bg-[#111111]/80 backdrop-blur-md border border-[#222222] rounded-xl";
const PAGE_SIZE = 10;

export default function Dashboard({ session }) {
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

    // Feed state
    const [feedLogs, setFeedLogs] = useState([]);
    const [feedOffset, setFeedOffset] = useState(0);
    const [feedHasMore, setFeedHasMore] = useState(false);
    const [feedLoading, setFeedLoading] = useState(false);
    const [feedTotal, setFeedTotal] = useState(0);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState(0);
    const [chartRange, setChartRange] = useState(7);

    // UI state
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [notionDbId, setNotionDbId] = useState("");
    const [notionApiKey, setNotionApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);

    // Revenue personalization
    const [avgLeadValue, setAvgLeadValue] = useState(500);
    const [editingRevenue, setEditingRevenue] = useState(false);
    const [tempValue, setTempValue] = useState("500");
    const revenueInputRef = useRef(null);

    // Confetti: track last known lead count
    const prevLeadCountRef = useRef(null);

    const location = useLocation();

    // Derived
    const gmailConnected = !!userProfile?.gmail_connected;
    const notionConfigured = !!userProfile?.notion_configured;
    const planType = userProfile?.plan_type || "starter";
    const planLimit = PLAN_LIMITS[planType] || 30;
    const syncCount = userProfile?.current_month_sync_count || 0;
    const limitReached = planType !== "pro" && syncCount >= planLimit;

    let trialExpired = false;
    if (planType === "pro" && userProfile?.trial_start) {
        const diff = Math.floor((Date.now() - new Date(userProfile.trial_start).getTime()) / 86400000);
        trialExpired = Math.max(0, 14 - diff) <= 0;
    }

    const totalLeads = dashboardStats?.total_leads || 0;
    const leadsThisWeek = dashboardStats?.leads_this_week || 0;
    const highIntentPct = dashboardStats?.high_intent_pct;

    // Hydrate avg_lead_value from profile
    useEffect(() => {
        if (userProfile?.avg_lead_value != null) {
            setAvgLeadValue(userProfile.avg_lead_value);
            setTempValue(String(userProfile.avg_lead_value));
        }
    }, [userProfile?.avg_lead_value]);

    // Confetti trigger when total leads increases
    useEffect(() => {
        if (prevLeadCountRef.current !== null && totalLeads > prevLeadCountRef.current) {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.3 },
                colors: ['#2563eb', '#ffffff', '#60a5fa', '#93c5fd']
            });
        }
        prevLeadCountRef.current = totalLeads;
    }, [totalLeads]);

    // URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        if (error) { showToastMsg("error", "Gmail connection issue: " + decodeURIComponent(error)); window.history.replaceState({}, "", "/dashboard"); }
        const checkout = params.get("checkout");
        if (checkout === "success") { showToastMsg("success", "Payment successful!"); window.history.replaceState({}, "", "/dashboard"); }
        if (checkout === "canceled") { showToastMsg("error", "Checkout was canceled."); window.history.replaceState({}, "", "/dashboard"); }
        if (params.get("step") === "1" && params.get("success") === "true") { showToastMsg("success", "Gmail connected!"); window.history.replaceState({}, "", "/dashboard"); }
        if (params.get("activate") === "pro") { showToastMsg("success", "Complete setup to start your 14-day trial."); window.history.replaceState({}, "", "/dashboard"); }
    }, [location.search]);

    const showToastMsg = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 5000); };

    // Core data fetch
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchCore = async () => {
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
        fetchCore();
        const interval = setInterval(fetchCore, 15000);
        return () => clearInterval(interval);
    }, [session?.user?.id]);

    // Chart data
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchCharts = async () => {
            try {
                const volRes = await fetch(`${API_URL}/api/analytics/volume?user_id=${session.user.id}&days=${chartRange}`);
                const volData = await volRes.json();
                if (volData?.success) { setVolumeData(volData.data); localStorage.setItem(`ll_volume_${session.user.id}`, JSON.stringify(volData.data)); }
            } catch (err) { console.error("Volume fetch failed:", err); }
            try {
                const distRes = await fetch(`${API_URL}/api/analytics/distribution?user_id=${session.user.id}&days=${chartRange}`);
                const distData = await distRes.json();
                if (distData?.success) { setDistributionData(distData.data); localStorage.setItem(`ll_dist_${session.user.id}`, JSON.stringify(distData.data)); }
            } catch (err) { console.error("Distribution fetch failed:", err); }
        };
        fetchCharts();
    }, [session?.user?.id, chartRange]);

    // Paginated feed
    const fetchFeed = useCallback(async (offset = 0, append = false) => {
        if (!session?.user?.id) return;
        setFeedLoading(true);
        try {
            const params = new URLSearchParams({ user_id: session.user.id, limit: PAGE_SIZE, offset });
            if (searchQuery) params.set("search", searchQuery);
            if (dateFilter === 1) params.set("days", "1");
            else if (dateFilter === 7) params.set("days", "7");
            else if (dateFilter === 30) params.set("days", "30");
            const res = await fetch(`${API_URL}/api/user/sync-logs?${params}`);
            const data = await res.json();
            if (data?.success) {
                const logs = data.data || [];
                setFeedLogs(prev => append ? [...prev, ...logs] : logs);
                setFeedHasMore(data.has_more || false);
                setFeedTotal(data.total || 0);
                setFeedOffset(offset + logs.length);
            }
        } catch (err) { console.error("Feed fetch failed:", err); }
        finally { setFeedLoading(false); }
    }, [session?.user?.id, searchQuery, dateFilter]);

    useEffect(() => { fetchFeed(0, false); }, [fetchFeed]);
    const handleLoadMore = () => { fetchFeed(feedOffset, true); };

    const filteredLogs = priorityFilter === "All" ? feedLogs : feedLogs.filter(log => getIntent(log.lead_email) === priorityFilter);

    // Handlers
    const handleGoogleConnect = () => { if (!session?.user?.id) return; window.location.href = `${API_URL}/auth/google?user_id=${session.user.id}`; };

    const handleSaveNotionConfig = async () => {
        if (!notionDbId) { showToastMsg("error", "Please enter a Notion Database ID."); return; }
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/user/notion-config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: session.user.id, notion_db_id: notionDbId, notion_api_key: notionApiKey || undefined }) });
            const data = await response.json();
            if (data.success) { setShowConfigModal(false); showToastMsg("success", "Notion database connected!"); const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`); const profData = await profRes.json(); if (profData?.success) setUserProfile(profData.data); }
            else showToastMsg("error", "Failed to save: " + (data.error || "Unknown error"));
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

    const handleSaveLeadValue = async () => {
        const parsed = parseInt(tempValue, 10);
        if (isNaN(parsed) || parsed < 0) { showToastMsg("error", "Please enter a valid number."); return; }
        setAvgLeadValue(parsed);
        setEditingRevenue(false);
        try {
            await fetch(`${API_URL}/api/user/avg-lead-value`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: session.user.id, avg_lead_value: parsed }) });
        } catch (err) { console.error("Save lead value failed:", err); }
    };

    // Focus revenue input when editing
    useEffect(() => { if (editingRevenue && revenueInputRef.current) revenueInputRef.current.focus(); }, [editingRevenue]);

    return (
        <main className="min-h-screen bg-[#030303] pt-24 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Breadcrumb items={[{ label: "Dashboard" }]} />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5" title={gmailConnected ? "Gmail Connected" : "Gmail Disconnected"}>
                            {gmailConnected ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span></span> : <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
                            <span className="text-[11px] text-gray-500 font-medium">Gmail</span>
                        </div>
                        <div className="flex items-center gap-1.5" title={notionConfigured ? "Notion Linked" : "Notion Disconnected"}>
                            {notionConfigured ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span></span> : <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
                            <span className="text-[11px] text-gray-500 font-medium">Notion</span>
                        </div>
                        {(!gmailConnected || !notionConfigured) && (
                            <button onClick={() => !gmailConnected ? handleGoogleConnect() : setShowConfigModal(true)} className="text-[11px] text-[#2563eb] hover:text-blue-400 font-semibold transition-colors">Setup</button>
                        )}
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${toast.type === "success" ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800" : "bg-red-900/30 text-red-300 border border-red-800"}`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100"><X size={16} /></button>
                    </div>
                )}

                {/* Banners */}
                {limitReached && (
                    <div className={`${CARD} p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                        <div className="flex items-start gap-3"><AlertTriangle size={22} className="text-amber-500 flex-shrink-0 mt-0.5" /><div><p className="font-semibold text-white text-sm">Monthly limit reached</p><p className="text-xs text-gray-400">Upgrade to continue syncing.</p></div></div>
                        <button onClick={() => handleUpgrade("pro")} className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm">Upgrade</button>
                    </div>
                )}
                {trialExpired && planType === "pro" && (
                    <div className={`${CARD} p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                        <div className="flex items-start gap-3"><CreditCard size={22} className="text-amber-500 flex-shrink-0 mt-0.5" /><div><p className="font-semibold text-white text-sm">Pro trial expired</p><p className="text-xs text-gray-400">Subscribe to keep pro features.</p></div></div>
                        <button onClick={() => handleUpgrade("pro")} className="bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm">Subscribe</button>
                    </div>
                )}
                {!limitReached && !trialExpired && userProfile && (
                    <div className={`${CARD} p-4 mb-6 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            {planType === "pro" && <Crown size={16} className="text-emerald-500" />}
                            {planType === "plus" && <Zap size={16} className="text-blue-500" />}
                            <span className="text-sm font-bold text-white">{planType === "pro" ? "LeadLooms Pro" : planType === "plus" ? "LeadLooms Plus" : "Starter Plan"}</span>
                            {planType !== "pro" && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#2563eb]/20 text-blue-400">{syncCount}/{planLimit}</span>}
                        </div>
                        {planType !== "pro" && <button onClick={() => handleUpgrade("pro")} className="text-xs bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all">Upgrade</button>}
                    </div>
                )}

                {/* ======================== TIER 1: STATS ======================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Revenue Protected — Interactive */}
                    <div className={`${CARD} p-5 flex flex-col justify-between h-[110px] cursor-pointer group`} onClick={() => { if (!editingRevenue) { setEditingRevenue(true); setTempValue(String(avgLeadValue)); } }}>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Revenue Protected</span>
                            {!editingRevenue && <Pencil size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />}
                        </div>
                        {editingRevenue ? (
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <span className="text-lg font-bold text-gray-500">$</span>
                                <input ref={revenueInputRef} type="number" value={tempValue} onChange={e => setTempValue(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSaveLeadValue(); if (e.key === "Escape") setEditingRevenue(false); }} className="w-20 bg-transparent border-b border-gray-600 text-white text-lg font-bold outline-none" />
                                <span className="text-xs text-gray-500">/ lead</span>
                                <button onClick={handleSaveLeadValue} className="text-xs bg-[#2563eb] text-white px-2 py-1 rounded-md font-semibold">Save</button>
                            </div>
                        ) : (
                            <p className="text-3xl font-black text-[#10b981] tracking-tight" style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
                                <AnimatedNumber value={totalLeads * avgLeadValue} prefix="$" />
                            </p>
                        )}
                    </div>

                    {/* AI Intent */}
                    <div className={`${CARD} p-5 flex flex-col justify-between h-[110px]`}>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">AI Intent Score</span>
                        <p className="text-3xl font-black text-white tracking-tight">
                            {highIntentPct != null ? <><AnimatedNumber value={highIntentPct} suffix="%" /> <span className="text-sm font-semibold text-gray-500">High</span></> : <span className="text-gray-600">—</span>}
                        </p>
                    </div>

                    {/* This Week */}
                    <div className={`${CARD} p-5 flex flex-col justify-between h-[110px]`}>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">This Week</span>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-black text-white tracking-tight"><AnimatedNumber value={leadsThisWeek} /></p>
                            <TrendingUp size={18} className="text-[#10b981]" />
                        </div>
                    </div>

                    {/* System Pulse */}
                    <div className={`${CARD} p-5 flex flex-col justify-between h-[110px]`}>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">System Pulse</span>
                        <div className="flex items-center gap-2.5">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span></span>
                            <span className="text-base font-bold text-white">Active & Secure</span>
                        </div>
                    </div>
                </div>

                {/* ======================== TIER 2: ANALYTICS ======================== */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white">Analytics</h2>
                    <div className="flex items-center bg-[#111111] border border-[#222222] rounded-lg p-0.5">
                        {[7, 30, 90].map(d => (
                            <button key={d} onClick={() => setChartRange(d)} className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${chartRange === d ? 'bg-[#2563eb] text-white shadow' : 'text-gray-500 hover:text-white'}`}>{d}D</button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <div className={`lg:col-span-2 ${CARD} p-5 flex flex-col h-[320px]`}>
                        <div className="mb-2"><h3 className="text-sm font-semibold text-white">Lead Momentum</h3><p className="text-xs text-gray-500">Inbound volume over {chartRange} days.</p></div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={volumeData || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs><linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                                    <XAxis dataKey="date" stroke="#333" tick={{ fontSize: 10, fill: '#555' }} tickLine={false} axisLine={false} tickFormatter={v => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }} minTickGap={30} />
                                    <YAxis stroke="#333" tick={{ fontSize: 10, fill: '#555' }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '10px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#fff', fontWeight: 600 }} cursor={{ stroke: '#333', strokeDasharray: '4 4' }} />
                                    <Area type="monotone" dataKey="leads" name="Leads" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLeads)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} animationDuration={1000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={`${CARD} p-5 flex flex-col h-[320px] relative overflow-hidden`}>
                        <div><h3 className="text-sm font-semibold text-white">Source Distribution</h3><p className="text-xs text-gray-500">Business vs Personal.</p></div>
                        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distributionData || []} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1000} cornerRadius={3}>
                                        {(distributionData || []).map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '10px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#fff', fontWeight: 600 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {(distributionData || []).map((entry, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span>{entry.name} ({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ======================== TIER 3: INTELLIGENCE FEED ======================== */}
                <div className={`${CARD} overflow-hidden`}>
                    {/* Filter Bar */}
                    <div className="p-5 border-b border-[#222222] flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-[280px]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by lead email..." className="w-full bg-white/5 border border-[#222222] text-white text-sm rounded-lg pl-9 pr-3 py-2 placeholder:text-gray-600 focus:ring-1 focus:ring-[#2563eb]/40 focus:border-[#2563eb]/40 outline-none transition-all" />
                        </div>
                        <div className="flex items-center bg-[#0a0a0a] border border-[#222222] rounded-lg p-0.5">
                            {["All", "High", "Medium", "Spam"].map(p => (
                                <button key={p} onClick={() => setPriorityFilter(p)} className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${priorityFilter === p ? 'bg-[#1a1a1a] text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}>{p}</button>
                            ))}
                        </div>
                        <div className="relative">
                            <select value={dateFilter} onChange={e => setDateFilter(Number(e.target.value))} className="appearance-none bg-white/5 border border-[#222222] text-gray-400 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 outline-none focus:ring-1 focus:ring-[#2563eb]/40 cursor-pointer">
                                <option value={0}>All Time</option>
                                <option value={1}>Today</option>
                                <option value={7}>Last 7D</option>
                                <option value={30}>Last 30D</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                        <span className="text-xs text-gray-600 ml-auto">{feedTotal} total</span>
                    </div>

                    {/* List */}
                    {(limitReached || trialExpired) ? (
                        <div className="p-10 text-center text-gray-500"><AlertTriangle size={26} className="mx-auto mb-3 opacity-40" /><p className="text-sm">Syncing is paused. Upgrade to resume.</p></div>
                    ) : filteredLogs.length > 0 ? (
                        <>
                            <ul className="divide-y divide-[#1a1a1a]">
                                {filteredLogs.map(log => {
                                    const diffMs = Date.now() - new Date(log.sync_time).getTime();
                                    const diffMins = Math.floor(diffMs / 60000);
                                    const diffHours = Math.floor(diffMins / 60);
                                    const diffDays = Math.floor(diffHours / 24);
                                    const timeAgo = diffDays > 0 ? `${diffDays}d ago` : diffHours > 0 ? `${diffHours}h ago` : diffMins > 0 ? `${diffMins}m ago` : "just now";
                                    const intent = getIntent(log.lead_email);
                                    const initials = log.lead_email ? log.lead_email.substring(0, 2).toUpperCase() : "??";

                                    return (
                                        <li key={log.id} onClick={() => setSelectedLead(log)} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                                            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">{initials}</div>
                                            <SummaryTooltip summary={log.summary}>
                                                <span className="text-sm font-medium text-white truncate block max-w-[240px]">{log.lead_email}</span>
                                            </SummaryTooltip>
                                            <div className="flex-1"></div>
                                            <IntentPill intent={intent} />
                                            <span className="text-xs text-gray-600 whitespace-nowrap hidden sm:block min-w-[60px] text-right">{timeAgo}</span>
                                            <ChevronRight size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                                        </li>
                                    );
                                })}
                            </ul>
                            {feedHasMore && (
                                <div className="p-4 border-t border-[#1a1a1a]">
                                    <button onClick={handleLoadMore} disabled={feedLoading} className="w-full bg-[#111111] hover:bg-[#1a1a1a] text-gray-400 hover:text-white text-sm font-medium py-3 rounded-xl border border-[#222222] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                        {feedLoading ? <><Loader2 size={14} className="animate-spin" /> Loading...</> : "Load More"}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-10 text-center text-gray-600"><p className="text-sm">{feedLoading ? "Loading..." : searchQuery ? "No leads match your search." : "No sync activity yet."}</p></div>
                    )}
                </div>
            </div>

            {/* Slide-over */}
            <AnimatePresence>{selectedLead && <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} />}</AnimatePresence>

            {/* Config Modal */}
            {showConfigModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0a0a0a] rounded-2xl border border-[#222222] shadow-2xl w-full max-w-md p-6 relative">
                        <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><Database size={20} className="text-[#2563eb]" /> Connect Notion</h3>
                        <p className="text-sm text-gray-500 mb-5">Enter your Notion Database ID.</p>
                        <div className="space-y-4">
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">Database ID <span className="text-red-500">*</span></label><input type="text" value={notionDbId} onChange={e => setNotionDbId(e.target.value)} placeholder="e.g. 1a2b3c4d..." className="w-full border border-[#333] bg-[#111111] text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all" autoFocus /></div>
                            <div><label className="block text-sm font-medium text-gray-300 mb-1">API Key <span className="text-gray-600">(optional)</span></label><input type="password" value={notionApiKey} onChange={e => setNotionApiKey(e.target.value)} placeholder="secret_..." className="w-full border border-[#333] bg-[#111111] text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] outline-none transition-all" /></div>
                            <button onClick={handleSaveNotionConfig} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"><Save size={16} /> {isSaving ? "Saving..." : "Save & Connect"}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
