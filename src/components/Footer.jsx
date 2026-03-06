import { Link, useLocation } from "react-router-dom";

export default function Footer() {
    const location = useLocation();
    const showCTA = ["/", "/pricing"].includes(location.pathname);

    return (
        <>
            {/* Final CTA Strip */}
            {showCTA && (
                <section className="bg-gray-900 dark:bg-gray-950 py-20 transition-colors">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
                            Ready to Stop Losing Leads?
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Connect your Gmail to Notion in under 5 minutes and never drop the ball on a prospect again.
                        </p>
                        <a
                            href="https://calendly.com/thetpine254/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex bg-primary hover:bg-blue-600 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Schedule Your Demo
                        </a>
                    </div>
                </section>
            )}

            {/* Actual Footer */}
            <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    LL
                                </div>
                                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">LeadLoom</span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                                The Notion-native edge for modern sales teams. Turn your inbox into an organized powerhouse.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link to="/#features" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Features</Link></li>
                                <li><Link to="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Pricing</Link></li>
                                <li><a href="https://calendly.com/thetpine254/30min" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Book Demo</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="mailto:leadloomsg@gmail.com" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} LeadLoom. All rights reserved.</p>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <a href="https://x.com/LeadLooms" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
                            <a href="https://www.linkedin.com/in/thetpine/" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
