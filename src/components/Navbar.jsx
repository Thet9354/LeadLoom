import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? "bg-white/80 backdrop-blur-md border-gray-100 shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg leading-none shadow-md">
                            LL
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">LeadLoom</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Pricing
                        </a>
                        <a href="mailto:leadloomsg@gmail.com" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            Contact
                        </a>
                    </div>

                    <div className="hidden md:flex items-center">
                        <a
                            href="https://calendly.com/thetpine254/30min"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-2xl shadow-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Book Demo
                        </a>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-900 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <a
                            href="#features"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Features
                        </a>
                        <a
                            href="#pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Pricing
                        </a>
                        <a
                            href="mailto:leadloomsg@gmail.com"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                        >
                            Contact
                        </a>
                        <div className="pt-2">
                            <a
                                href="https://calendly.com/thetpine254/30min"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex justify-center bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Book Demo
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
