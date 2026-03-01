import { useState, useEffect } from "react";
import { Database, AlertTriangle, CheckCircle, Mail, Circle, X, Save, AlertCircle, Zap, Crown, CreditCard, Lock } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { API_URL } from '../config';

const PLAN_LIMITS = { starter: 30, plus: 100, pro: Infinity };

export default function Dashboard({ session }) {
    const [syncLogs, setSyncLogs] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    // Onboarding state — derived from profile, not manually tracked
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [notionDbId, setNotionDbId] = useState("");
    const [notionApiKey, setNotionApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const location = useLocation();

    // Derive setup status from profile data (single source of truth)
    const gmailConnected = !!userProfile?.gmail_connected;
    const notionConfigured = !!userProfile?.notion_configured;

    // Plan helpers
    const planType = userProfile?.plan_type || "starter";
    const planLimit = PLAN_LIMITS[planType] || 30;
    const syncCount = userProfile?.current_month_sync_count || 0;
    const limitReached = planType !== "pro" && syncCount >= planLimit;

    // Card activation (must come after planType)
    const cardActivated = planType !== "starter";
    const setupComplete = gmailConnected && notionConfigured && cardActivated;

    // Calculate Trial Days (only for Pro trial users)
    let daysRemaining = 14;
    let trialExpired = false;
    if (userProfile && planType === "pro" && userProfile.trial_start_date) {
        const start = new Date(userProfile.trial_start_date);
        const current = new Date();
        const diffDays = Math.floor((current - start) / (1000 * 60 * 60 * 24));
        daysRemaining = Math.max(0, 14 - diffDays);
        trialExpired = daysRemaining <= 0;
    }

    // Handle URL params (OAuth errors, checkout status)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const error = params.get("error");
        if (error) {
            showToastMsg("error", "Gmail connection issue: " + decodeURIComponent(error));
            window.history.replaceState({}, "", "/dashboard");
        }
        const checkout = params.get("checkout");
        if (checkout === "success") {
            showToastMsg("success", "Payment successful! Your plan will activate shortly.");
            window.history.replaceState({}, "", "/dashboard");
        }
        if (checkout === "canceled") {
            showToastMsg("error", "Checkout was canceled.");
            window.history.replaceState({}, "", "/dashboard");
        }
        // If OAuth redirected with success, show a brief toast
        if (params.get("step") === "1" && params.get("success") === "true") {
            showToastMsg("success", "Gmail connected successfully!");
            window.history.replaceState({}, "", "/dashboard");
        }
        // Pro trial activation redirect
        if (params.get("activate") === "pro") {
            showToastMsg("success", "Almost there! Complete setup below, then activate your card to start your 14-day free trial.");
            window.history.replaceState({}, "", "/dashboard");
        }
    }, [location.search]);

    const showToastMsg = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    };

    // Fetch Sync Logs and Profile
    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchData = async () => {
            try {
                const logRes = await fetch(`${API_URL}/api/user/sync-logs?user_id=${session.user.id}`);
                const logData = await logRes.json();
                if (logData?.success && Array.isArray(logData?.data)) setSyncLogs(logData.data);
                else setSyncLogs([]);
            } catch (err) {
                console.error("Failed to fetch sync logs:", err);
            }

            try {
                const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const profData = await profRes.json();
                if (profData?.success) {
                    setUserProfile(profData.data);
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [session?.user?.id]);

    const handleGoogleConnect = () => {
        if (!session?.user?.id) return;
        window.location.href = `${API_URL}/auth/google?user_id=${session.user.id}`;
    };

    const handleSaveNotionConfig = async () => {
        if (!notionDbId) {
            showToastMsg("error", "Please enter a Notion Database ID.");
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/user/notion-config`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: session.user.id,
                    notion_db_id: notionDbId,
                    notion_api_key: notionApiKey || undefined
                }),
            });
            const data = await response.json();
            if (data.success) {
                setShowConfigModal(false);
                showToastMsg("success", "Notion database connected!");
                // Re-fetch profile to update state
                const profRes = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const profData = await profRes.json();
                if (profData?.success) setUserProfile(profData.data);
            } else {
                showToastMsg("error", "Failed to save: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            showToastMsg("error", "Network error: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpgrade = async (plan = "pro") => {
        if (!session?.user?.id) return;
        try {
            const response = await fetch(`${API_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, plan })
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
        } catch (error) {
            console.error("Checkout Error:", error);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: "Dashboard" }]} />

                {/* Toast Notification */}
                {toast && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm ${toast.type === "success"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        }`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Sync Limit Reached Banner */}
                {limitReached && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 p-6 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Sync Limit Reached</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You've used {syncCount}/{planLimit} lead syncs this month on the {planType === "plus" ? "Plus" : "Starter"} plan. Upgrade to continue syncing.
                                </p>
                            </div>
                        </div>
                        <button onClick={() => handleUpgrade(planType === "starter" ? "plus" : "pro")} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            Upgrade Now
                        </button>
                    </div>
                )}

                {/* Trial Banner (only for Pro trial) */}
                {trialExpired && planType === "pro" && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 p-6 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Trial Expired</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your Pro trial has ended. Subscribe to continue syncing.</p>
                            </div>
                        </div>
                        <button onClick={() => handleUpgrade("pro")} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap">
                            Subscribe to Pro
                        </button>
                    </div>
                )}

                {/* Active Plan Banner */}
                {!limitReached && !trialExpired && userProfile && (
                    <div className={`p-5 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4 ${planType === "pro"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
                        : planType === "plus"
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
                            : "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800"
                        }`}>
                        <div>
                            <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-lg mb-1">
                                {planType === "pro" && <Crown size={18} className="text-emerald-500" />}
                                {planType === "plus" && <Zap size={18} className="text-blue-500" />}
                                {planType === "pro" ? "LeadLoom Pro" : planType === "plus" ? "LeadLoom Plus" : "Starter Plan"}
                                {planType !== "pro" && (
                                    <span className={`text-sm font-semibold px-2 py-0.5 rounded ${planType === "plus"
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50"
                                        : "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50"
                                        }`}>
                                        {syncCount}/{planLimit} syncs
                                    </span>
                                )}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {planType === "pro"
                                    ? "Unlimited syncs, AI hooks — all features unlocked."
                                    : planType === "plus"
                                        ? "Upgrade to Pro for unlimited syncs and AI hooks."
                                        : "Upgrade for more lead syncs and premium features."}
                            </p>
                        </div>
                        {planType !== "pro" && (
                            <button onClick={() => handleUpgrade("pro")} className="bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm">
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                )}

                {/* ============ ONBOARDING CHECKLIST ============ */}
                {!setupComplete && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-100 dark:border-gray-800 p-6">
                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Get Started 🚀</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Complete these steps to start syncing leads automatically.</p>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Step 1: Connect Gmail */}
                            <div className={`p-5 rounded-xl border transition-colors ${gmailConnected ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                        {gmailConnected ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white">1. Connect your Gmail</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">Securely connect the Gmail account you use to communicate with leads.</p>
                                        {gmailConnected ? (
                                            <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium text-xs">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Connected
                                            </span>
                                        ) : (
                                            <button onClick={handleGoogleConnect} className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold py-2 px-4 rounded-xl shadow-sm transition-all hover:shadow-md text-sm">
                                                <Mail className="w-4 h-4 text-red-500" />
                                                Connect with Google
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Configure Notion (Locked until Gmail done) */}
                            <div className={`p-5 rounded-xl border transition-all ${notionConfigured ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : gmailConnected ? 'bg-white dark:bg-gray-800 border-primary/30 dark:border-primary/20 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-50 pointer-events-none'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                        {notionConfigured ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className={`w-5 h-5 ${gmailConnected ? 'text-primary/40' : 'text-gray-300 dark:text-gray-600'}`} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white">2. Connect your Notion Database</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">Tell us where to send your leads.</p>
                                        {notionConfigured ? (
                                            <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium text-xs">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Database Linked
                                            </span>
                                        ) : gmailConnected ? (
                                            <button onClick={() => setShowConfigModal(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm">
                                                <Database className="w-4 h-4" />
                                                Configure Notion
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Activate Subscription / Card (Locked until Gmail + Notion done) */}
                            <div className={`p-5 rounded-xl border transition-all ${cardActivated ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : (gmailConnected && notionConfigured) ? 'bg-white dark:bg-gray-800 border-primary/30 dark:border-primary/20 shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-50 pointer-events-none'}`}>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                        {cardActivated ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className={`w-5 h-5 ${(gmailConnected && notionConfigured) ? 'text-primary/40' : 'text-gray-300 dark:text-gray-600'}`} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white">3. Activate Subscription</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-3">Authorize your card to start your 14-day free trial. You won't be charged today.</p>
                                        {cardActivated ? (
                                            <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium text-xs">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Activated
                                            </span>
                                        ) : (gmailConnected && notionConfigured) ? (
                                            <button onClick={() => handleUpgrade('pro')} className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 text-sm">
                                                <CreditCard className="w-4 h-4" />
                                                Activate Card
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Setup Complete Banner */}
                {setupComplete && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 p-5 mb-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={22} className="text-green-500" />
                            <div>
                                <span className="font-bold text-gray-900 dark:text-white">All integrations connected!</span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">LeadLoom is actively monitoring your inbox.</p>
                            </div>
                        </div>
                        <Link to="/settings" className="text-sm text-primary font-medium hover:underline whitespace-nowrap">Manage in Settings →</Link>
                    </div>
                )}

                {/* Sync Activity Feed */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                            <Database size={20} className="text-blue-500" /> Recent Sync Activity
                        </h2>
                    </div>
                    {(limitReached || trialExpired) ? (
                        <div className="p-8 text-center">
                            <AlertTriangle size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {limitReached ? "Monthly sync limit reached. Upgrade to continue." : "Syncing is paused. Subscribe to resume."}
                            </p>
                        </div>
                    ) : syncLogs && syncLogs.length > 0 ? (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {syncLogs.map(log => (
                                <li key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{log.lead_email}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(log.sync_time).toLocaleString()}</span>
                                    </div>
                                    <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-md font-medium text-xs border border-green-200 dark:border-green-800">
                                        Synced
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center">
                            <Database size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No sync activity yet. {!setupComplete && "Complete setup above to begin."}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ============ INLINE CONFIG MODAL ============ */}
            {showConfigModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-md p-6 relative">
                        <button onClick={() => setShowConfigModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <X size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                            <Database size={20} className="text-blue-500" /> Connect Notion
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Enter your Notion Database ID to start syncing leads.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Database ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={notionDbId}
                                    onChange={(e) => setNotionDbId(e.target.value)}
                                    placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key <span className="text-gray-400 dark:text-gray-500">(optional)</span></label>
                                <input
                                    type="password"
                                    value={notionApiKey}
                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                    placeholder="secret_..."
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleSaveNotionConfig}
                                disabled={isSaving}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />
                                {isSaving ? "Saving..." : "Save & Connect"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
