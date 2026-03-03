import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
                        <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Scope of Service</h2>
                            <p>
                                Welcome to LeadLooms. We provide a service that connects and synchronizes lead data
                                seamlessly between Gmail and Notion. By using LeadLooms (the "Service"), you agree to
                                be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Account and Billing</h2>
                            <p>
                                LeadLooms offers a free 14-day trial for new accounts. To continue utilizing the Service
                                after the trial period, a recurring monthly subscription ($19/month or $49/month) is required.
                                Billing occurs on a recurring basis, and you can cancel your subscription at any time via
                                your account settings. Refunds are handled on a case-by-case basis.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Data and Integrations</h2>
                            <p>
                                Our Service requires authorized access to your Gmail account (via OAuth) and your Notion
                                workspace (via API integration). You are responsible for maintaining the security of
                                your authentication tokens. We only store encrypted integration tokens required for operation
                                and do not permanently store your private data or emails beyond the duration necessary for extraction and sync.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Limitation of Liability</h2>
                            <p>
                                <strong>"AS-IS" BETA SOFTWARE:</strong> The Service is provided on an "as-is" and "as available" basis.
                                We make no warranties, either express or implied, regarding the reliability or availability of the
                                Service. In no event shall LeadLooms be held liable for any indirect, incidental, special,
                                consequential, or punitive damages, or any loss of profits or revenues (including data loss)
                                resulting from your use of the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Termination</h2>
                            <p>
                                We reserve the right to suspend or terminate your access to the Service at any time,
                                with or without cause or notice, especially in cases of abuse, fraud, or violation of these Terms.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
