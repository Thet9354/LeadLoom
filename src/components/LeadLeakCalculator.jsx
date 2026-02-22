import { useState } from "react";
import { Calculator, Hourglass, Ghost, CircleDollarSign } from "lucide-react";

export default function LeadLeakCalculator() {
    const [leadsPerMonth, setLeadsPerMonth] = useState(100);
    const [leadValue, setLeadValue] = useState(1000);

    // Assuming a 15% missing/delay rate
    const missedRate = 0.15;
    const lostRevenue = Math.round(leadsPerMonth * missedRate * leadValue);

    return (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        The Problem: <span className="text-red-500">The Lead Leak</span>
                    </h2>
                    <p className="text-xl text-gray-600">
                        Every missed or delayed reply is money gone. See how much your manual process is costing you.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Calculator Inputs */}
                    <div className="w-full lg:w-1/2 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-100 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Calculate Your Leak</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium text-gray-700">Monthly Leads</label>
                                    <span className="font-bold text-primary">{leadsPerMonth}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    value={leadsPerMonth}
                                    onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="font-medium text-gray-700">Average Value Per Lead</label>
                                    <span className="font-bold text-primary">${leadValue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="10000"
                                    step="100"
                                    value={leadValue}
                                    onChange={(e) => setLeadValue(Number(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="bg-red-50 rounded-2xl p-6 text-center border border-red-100">
                                    <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2">Potential Lost Revenue</p>
                                    <p className="text-5xl font-extrabold text-red-500">${lostRevenue.toLocaleString()}</p>
                                    <p className="text-xs text-red-400 mt-2 font-medium">Per month based on a 15% drop-off rate</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Value Props / Problem Cards */}
                    <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl flex-shrink-0">
                                <Hourglass className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Manual Entry</h4>
                                <p className="text-gray-600 text-sm">Copy-pasting from Gmail to Notion wastes hours of productive sales time every week.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-gray-100 text-gray-500 rounded-xl flex-shrink-0">
                                <Ghost className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Leads Ghost You</h4>
                                <p className="text-gray-600 text-sm">If you don't reply within 5 minutes, your chance of qualifying a lead drops by 80%.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl flex-shrink-0">
                                <CircleDollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Lost Deals</h4>
                                <p className="text-gray-600 text-sm">Every untracked email thread is a potential deal slipping through the cracks.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
