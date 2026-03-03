import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

const AppleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.53-3.23 0-1.44.62-2.2.44-3.06-.4C3.79 16.17 4.36 9.53 8.7 9.28c1.27.06 2.15.72 2.91.76.93-.19 1.82-.88 2.83-.8 1.2.1 2.1.59 2.7 1.49-2.46 1.49-1.88 4.77.53 5.68-.5 1.28-.93 2.53-1.62 3.87ZM12.03 9.21c-.13-2.31 1.79-4.28 3.95-4.47.27 2.56-2.31 4.62-3.95 4.47Z" />
    </svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
        <path d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.1V7.07H2.18A11.97 11.97 0 0 0 .96 12c0 1.94.46 3.77 1.22 5.33l3.66-3.24Z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Navigate to dashboard after successful OAuth sign-in
    // Account linking + toast notification is handled globally by LinkToast in App.jsx
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const provider = session.user.app_metadata?.provider;
                if (provider === 'google' || provider === 'apple') {
                    navigate('/dashboard');
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    // Handle bfcache (browser back button) restoring the page in a loading state
    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                setLoading(false);
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    const handleEmailSignIn = async () => {
        setLoading(true);
        setError(null);

        if (!email.trim()) {
            setError('Please enter your email address to sign in.');
            setLoading(false);
            return;
        }

        if (!password) {
            setError('Please enter your password.');
            setLoading(false);
            return;
        }

        try {
            // Attempt sign in with password — Supabase handles all validation:
            // - Rejects unconfirmed users ("Email not confirmed")
            // - Rejects wrong credentials ("Invalid login credentials")
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                const msg = authError.message?.toLowerCase() || '';
                if (msg.includes('invalid login credentials') || msg.includes('invalid password')) {
                    throw new Error('Incorrect email or password. Please try again.');
                } else if (msg.includes('email not confirmed')) {
                    throw new Error('Please confirm your email address before signing in. Check your inbox for the activation link.');
                } else if (msg.includes('disabled') || msg.includes('locked')) {
                    throw new Error('Account is locked/disabled. Please contact support.');
                }
                throw authError;
            }

            // Success — redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin + '/dashboard' },
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handlePasskeySignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPasskey();
            if (error) throw error;

            if (data?.user) {
                const userEmail = data.user.email || email;

                // The Gatekeeper: check if email exists in production profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('email', userEmail)
                    .single();

                if (!profile) {
                    await supabase.auth.signOut();
                    throw new Error("No account found with this email. Please sign up first!");
                }

                // Success — redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Failed to sign in with Passkey.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Brand header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-5">
                        <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/25">
                            LL
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Welcome back to LeadLooms
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
                    {/* Error banner */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 mb-6 rounded-r-lg">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300 text-sm">
                                <AlertCircle size={16} className="flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Email + Password sign-in (top) */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Email Addresses"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleEmailSignIn()}
                                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            onClick={handleEmailSignIn}
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* OAuth buttons (bottom) — Google → Apple → Passkey */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleOAuthSignIn('google')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        {/* <button
                            onClick={() => handleOAuthSignIn('apple')}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            <AppleIcon />
                            Continue with Apple
                        </button> */}

                        <button
                            onClick={handlePasskeySignIn}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <KeyRound size={18} />
                            Continue with Passkey
                        </button>
                    </div>
                </div>

                {/* Footer link */}
                <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
