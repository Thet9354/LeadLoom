import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-20 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-12"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
                        <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
                        <section>
                            <p className="lead">
                                At LeadLooms, we take your privacy seriously. This Privacy Policy outlines our practices
                                regarding data collection, processing, and protection in compliance with modern standards
                                including GDPR and CCPA.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
                            <p>
                                When you register for an account, we store basic profile information such as your email
                                address. We do not store extensive personal portfolios, only what is necessary to maintain
                                your account securely within Supabase.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Data Access and Integrations</h2>
                            <p>
                                LeadLooms functions by acting as a bridge between your email and workspace environments.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>Gmail Access:</strong> We connect to Gmail via standard OAuth. We only read
                                    the metadata and content of emails specifically scoped for lead extraction.
                                </li>
                                <li>
                                    <strong>Notion Access:</strong> We write to your Notion workspace using secure API keys. We
                                    only write extracted lead data to the directories you authorize.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Data Storage and Security</h2>
                            <p>
                                Security is our utmost priority:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>
                                    <strong>Integration Tokens:</strong> We store authorization codes and refresh tokens securely
                                    in encrypted structures (Supabase Vault/Encrypted storage), ensuring they are protected against unauthorized access.
                                </li>
                                <li>
                                    <strong>Email Contents:</strong> We <strong>DO NOT</strong> store your private email content.
                                    Once an email is processed and the lead is synced to Notion, the raw email content is discarded
                                    from our volatile memory.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Your Rights</h2>
                            <p>
                                You have the right to access, rectify, or delete your personal data. You can disconnect
                                your Gmail or Notion integrations at any time directly from the application settings, which
                                will instantly revoke our access to your accounts. You may also request total account deletion
                                by contacting our support.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
