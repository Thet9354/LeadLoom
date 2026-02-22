import { ArrowRight, InboxIcon, Database } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-40 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                        Seamless Gmail to Notion Sync
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                        Turn Your Inbox Into Your Most <span className="text-primary relative inline-block">Organized<svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" /></svg></span> Sales Team
                    </h1>

                    <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop letting leads die in your unread folder. Instantly sync emails into actionable Notion databases and track every conversation effortlessly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="https://calendly.com/thetpine254/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white text-lg font-semibold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
                        >
                            Book Your Demo
                            <ArrowRight className="w-5 h-5" />
                        </a>

                        <a
                            href="#features"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-lg font-medium py-4 px-8 rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1"
                        >
                            Learn More
                        </a>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 font-medium">No credit card required • 14-day free trial</p>
                </div>

                {/* Abstract Hero Image / Visualization */}
                <div className="mt-20 relative mx-auto max-w-5xl perspective-1000">
                    <div className="relative rounded-2xl lg:rounded-[2rem] bg-gray-900/5 p-2 lg:p-4 backdrop-blur-3xl border border-gray-200/50 shadow-2xl transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out">
                        <div className="bg-white rounded-xl lg:rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col md:flex-row">

                            {/* Fake Gmail UI segment */}
                            <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <InboxIcon className="w-6 h-6 text-red-500" />
                                    <span className="font-semibold text-gray-800">New Inquiries</span>
                                </div>

                                <div className="space-y-3 relative">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-3 relative z-10">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                                                {['JD', 'AS', 'MR'][i - 1]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm text-gray-900">{['John Doe', 'Alice Smith', 'Mark Ryan'][i - 1]}</span>
                                                    <span className="text-xs text-gray-400">10:4{i} AM</span>
                                                </div>
                                                <p className="text-xs text-gray-800 font-medium truncate">Interested in Enterprise Plan</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[180px]">We'd like to schedule a call to discuss...</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Decorative curved syncing line */}
                                    <svg className="absolute top-1/2 -right-8 w-24 h-12 text-primary z-20 hidden md:block" style={{ transform: 'translateY(-50%)' }} fill="none" viewBox="0 0 100 50">
                                        <path d="M0,25 Q50,25 100,25" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                                        <circle cx="50" cy="25" r="12" fill="white" stroke="currentColor" strokeWidth="2" />
                                        <path d="M46,21 L54,25 L46,29 Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>

                            {/* Fake Notion UI segment */}
                            <div className="w-full md:w-7/12 bg-white p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <Database className="w-6 h-6 text-gray-700" />
                                    <span className="font-semibold text-gray-800">CRM Database</span>
                                    <div className="ml-auto flex gap-2">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">Filter</span>
                                        <span className="px-2 py-1 bg-blue-600 rounded text-xs text-white font-medium">New</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="text-gray-400 border-b border-gray-100">
                                                <th className="pb-3 font-medium">Name</th>
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium">Action Needed</th>
                                                <th className="pb-3 font-medium text-right">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-700">
                                            {[
                                                { n: 'John Doe', s: 'New Lead', a: 'Reply within 24h', v: '$5,000', c: 'blue' },
                                                { n: 'Alice Smith', s: 'Contacted', a: 'Schedule Demo', v: '$2,500', c: 'amber' },
                                                { n: 'Mark Ryan', s: 'Meeting Booked', a: 'Prep Pitch', v: '$10,000', c: 'green' }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 font-medium flex items-center gap-2">
                                                        <span className="w-4 h-4 rounded border border-gray-200 flex items-center justify-center">
                                                            <span className="w-2 h-2 rounded-sm bg-gray-200"></span>
                                                        </span>
                                                        {row.n}
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${row.c}-100 text-${row.c}-700`}>{row.s}</span>
                                                    </td>
                                                    <td className="py-4 text-gray-500">{row.a}</td>
                                                    <td className="py-4 text-right font-medium">{row.v}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
