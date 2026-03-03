import { useState, useEffect } from "react";
import { Mail, Database, CheckCircle, Save, AlertCircle, Shield, Monitor, Smartphone, LogOut } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { API_URL } from '../config';
import { supabase } from '../supabaseClient';

export default function SettingsPage({ session }) {
    const [notionDbId, setNotionDbId] = useState("");
    const [notionApiKey, setNotionApiKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [gmailConnected, setGmailConnected] = useState(false);
    const [currentDevice, setCurrentDevice] = useState({ os: "Loading...", browser: "", location: "Fetching location..." });
    const [isSigningOutOthers, setIsSigningOutOthers] = useState(false);

    useEffect(() => {
        // Parse basic user agent
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

        // Attempt to fetch IP/Location securely (ignoring adblocker timeouts safely)
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.city && data.ip) {
                    setCurrentDevice(prev => ({ ...prev, location: `${data.city}, ${data.country} • ${data.ip}` }));
                } else {
                    setCurrentDevice(prev => ({ ...prev, location: "Location Unavailable" }));
                }
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
        if (!notionDbId) {
            showToast("error", "Please enter a Notion Database ID.");
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
                showToast("success", "Settings saved successfully!");
            } else {
                showToast("error", "Failed to save: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            showToast("error", "Network error: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSignOutOthers = async () => {
        setIsSigningOutOthers(true);
        try {
            const { error } = await supabase.auth.signOut({ scope: 'others' });
            if (error) throw error;
            showToast("success", "Successfully logged out of all other devices.");
        } catch (error) {
            showToast("error", "Failed to sign out other devices: " + error.message);
        } finally {
            setIsSigningOutOthers(false);
        }
    };

    const handleGoogleConnect = () => {
        if (!session?.user?.id) return;
        window.location.href = `${API_URL}/auth/google?user_id=${session.user.id}`;
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 transition-colors">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: "Settings" }]} />

                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">Account Settings</h1>

                {/* Toast */}
                {toast && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm ${toast.type === "success"
                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        }`}>
                        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {toast.message}
                    </div>
                )}

                {/* Gmail Connection */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">
                        <Mail size={20} className="text-red-500" /> Gmail Connection
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage the Gmail account linked to LeadLoom.</p>
                    {gmailConnected ? (
                        <span className="inline-flex items-center text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full font-medium text-sm">
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Connected
                        </span>
                    ) : (
                        <button onClick={handleGoogleConnect} className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2 px-5 rounded-xl shadow-sm transition-all hover:shadow-md">
                            <Mail className="w-5 h-5 text-red-500" />
                            Connect with Google
                        </button>
                    )}
                </div>

                {/* Notion Configuration */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">
                        <Database size={20} className="text-blue-500" /> Lead Configuration
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update the Notion database where your leads are synced.</p>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notion Database ID <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={notionDbId}
                                onChange={(e) => setNotionDbId(e.target.value)}
                                placeholder="e.g. 1a2b3c4d5e6f7g8h9i0j"
                                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notion API Key <span className="text-gray-400">(optional)</span></label>
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
                            className="w-fit flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={16} />
                            {isSaving ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </div>

                {/* Security & Devices */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mt-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-1">
                        <Shield size={20} className="text-purple-500" /> Security & Devices
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your active sessions and log out of unrecognized devices.</p>

                    <div className="space-y-4">
                        {/* Current Device */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                <div className="mt-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm">
                                    {currentDevice.os === "iOS" || currentDevice.os === "Android" ? (
                                        <Smartphone size={20} className="text-gray-600 dark:text-gray-300" />
                                    ) : (
                                        <Monitor size={20} className="text-gray-600 dark:text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        {currentDevice.os} • {currentDevice.browser}
                                        <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                                            Current Device
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {currentDevice.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Other Devices */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="flex items-start gap-4 mb-4 sm:mb-0 opacity-75">
                                <div className="mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-full shadow-sm">
                                    <Monitor size={20} className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Other Active Devices
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        Remote sessions linked to your account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOutOthers}
                                disabled={isSigningOutOthers}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium py-2 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50"
                            >
                                <LogOut size={16} />
                                {isSigningOutOthers ? "Signing out..." : "Sign Out"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
