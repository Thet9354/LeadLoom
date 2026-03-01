import { useEffect, useState } from "react";
import { CreditCard, CheckCircle, ExternalLink, Zap, Crown } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { API_URL } from '../config';

const PLAN_INFO = {
    starter: { label: "Starter", color: "gray", limit: "30 leads/month" },
    plus: { label: "Plus", color: "blue", limit: "100 leads/month" },
    pro: { label: "Pro", color: "emerald", limit: "Unlimited" },
};

export default function Billing({ session }) {
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(null); // which plan button is loading

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/api/user/profile?user_id=${session.user.id}`);
                const data = await res.json();
                if (data?.success) setUserProfile(data.data);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchProfile();
    }, [session?.user?.id]);

    const handleUpgrade = async (plan) => {
        if (!session?.user?.id) return;
        setIsLoading(plan);
        try {
            const response = await fetch(`${API_URL}/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: session.user.id, plan })
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else alert("Failed to create checkout session.");
        } catch (error) {
            alert("Network error: " + error.message);
        } finally {
            setIsLoading(null);
        }
    };

    const currentPlan = userProfile?.plan_type || "starter";
    const planInfo = PLAN_INFO[currentPlan] || PLAN_INFO.starter;
    const syncCount = userProfile?.current_month_sync_count || 0;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 transition-colors">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={[{ label: "Billing" }]} />

                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">Billing & Subscription</h1>

                {/* Current Plan Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                        <CreditCard size={20} className="text-blue-500" /> Current Plan
                    </h2>

                    {currentPlan === "pro" ? (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Crown size={24} className="text-emerald-500" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">LeadLoom Pro</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unlimited syncs, AI-powered hooks, and priority support.</p>
                        </div>
                    ) : currentPlan === "plus" ? (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap size={24} className="text-blue-500" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">LeadLoom Plus</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Up to 100 lead syncs per month.</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {syncCount}/100 syncs used this month
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={24} className="text-orange-500" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Starter (Free)</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Up to 30 lead syncs per month.</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {syncCount}/30 syncs used this month
                            </p>
                        </div>
                    )}
                </div>

                {/* Upgrade Options */}
                {currentPlan !== "pro" && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upgrade Your Plan</h2>
                        <div className="space-y-4">
                            {currentPlan === "starter" && (
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Plus — $19/mo</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">100 leads/month, custom auto-reply rules</p>
                                    </div>
                                    <button
                                        onClick={() => handleUpgrade("plus")}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                                    >
                                        <ExternalLink size={14} />
                                        {isLoading === "plus" ? "Redirecting..." : "Subscribe"}
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center justify-between p-4 border-2 border-primary/30 dark:border-primary/20 rounded-xl bg-blue-50/30 dark:bg-blue-900/10">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Pro — $49/mo
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">14-DAY FREE TRIAL</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Unlimited syncs, AI hooks, priority support</p>
                                </div>
                                <button
                                    onClick={() => handleUpgrade("pro")}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                                >
                                    <ExternalLink size={14} />
                                    {isLoading === "pro" ? "Redirecting..." : "Start Free Trial"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
