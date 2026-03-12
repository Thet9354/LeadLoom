import { motion } from "framer-motion";
import { X, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];

const getIntent = (email) => {
    if (!email || !email.includes("@")) return "Medium";
    const domain = email.split("@")[1]?.toLowerCase();
    if (PERSONAL_DOMAINS.includes(domain)) return "Medium";
    return "High";
};

const IntentPill = ({ intent }) => {
    const styles = {
        High: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
        Medium: "bg-blue-900/30 text-blue-400 border-blue-800/50",
        Spam: "bg-red-900/30 text-red-400 border-red-800/50"
    };
    return (
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${styles[intent] || styles.Medium}`}>
            {intent}
        </span>
    );
};

export default function LeadDetail({ lead, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(lead.lead_email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const intent = getIntent(lead.lead_email);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />
            <motion.div
                initial={{ x: 400 }}
                animate={{ x: 0 }}
                exit={{ x: 400 }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#0a0a0a] border-l border-[#222222] z-50 flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-[#222222] flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Lead Detail</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Avatar & Email */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-lg font-bold text-blue-400 flex-shrink-0">
                            {lead.lead_email ? lead.lead_email.substring(0, 2).toUpperCase() : "??"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{lead.lead_email}</p>
                            <IntentPill intent={intent} />
                        </div>
                    </div>

                    {/* Email Copy */}
                    <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 flex-1 truncate font-mono">{lead.lead_email}</span>
                            <button
                                onClick={handleCopy}
                                className="text-xs flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors bg-[#111111] border border-[#222222] rounded-lg px-3 py-1.5"
                            >
                                <Copy size={12} />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>

                    {/* Synced At */}
                    <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Synced At</label>
                        <p className="text-sm text-gray-300">{new Date(lead.sync_time).toLocaleString()}</p>
                    </div>

                    {/* Notion Link */}
                    <div>
                        <label className="text-[10px] font-medium text-gray-500 uppercase tracking-widest mb-2 block">Notion</label>
                        <a
                            href={lead.notion_page_url || "https://notion.so"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                        >
                            <ExternalLink size={14} />
                            Open in Notion
                        </a>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

export { getIntent, IntentPill };
