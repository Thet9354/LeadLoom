import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LinkToast — Global component that detects when a Google/Apple OAuth
 * identity is linked to an existing email/password account for the first time.
 *
 * Detection logic:
 *   1. Listen for SIGNED_IN events.
 *   2. Check if the user has 2+ identities (e.g., "email" + "google").
 *   3. If localStorage flag `ll_linked_toast_{userId}` is NOT set, show the toast.
 *   4. Set the flag so it never shows again.
 */
export default function LinkToast() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const user = session.user;
                    const identities = user.identities || [];

                    // Check if user has multiple identity providers (email + oauth)
                    const providers = identities.map((i) => i.provider);
                    const hasEmail = providers.includes('email');
                    const hasOAuth = providers.includes('google') || providers.includes('apple');

                    if (hasEmail && hasOAuth && identities.length >= 2) {
                        const storageKey = `ll_linked_toast_${user.id}`;
                        if (!localStorage.getItem(storageKey)) {
                            // First-time link detected
                            setVisible(true);
                            localStorage.setItem(storageKey, 'true');

                            // Auto-dismiss after 6 seconds
                            setTimeout(() => setVisible(false), 6000);
                        }
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[calc(100%-2rem)]"
                >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 p-4 flex items-start gap-3">
                        <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 w-9 h-9 rounded-xl flex items-center justify-center">
                            <Link2 size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                Account Linked
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                                We've linked your Google log in to your existing account to keep things simple.
                            </p>
                        </div>
                        <button
                            onClick={() => setVisible(false)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-0.5"
                            aria-label="Dismiss"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
