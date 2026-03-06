import { useState, useEffect, useRef } from "react";
import { Menu, X, Settings, CreditCard, LayoutDashboard, LogOut, Sun, Moon, ChevronDown, FileText, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useTheme } from "../ThemeContext";

export default function Navbar({ session }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
        navigate("/");
    };

    const getInitials = () => {
        const email = session?.user?.email || "";
        return email.slice(0, 2).toUpperCase();
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent ${isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-100 dark:border-gray-800 shadow-sm" : "bg-transparent"}`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg leading-none shadow-md">
                            LL
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">LeadLoom</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                            Features
                        </Link>
                        <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                            Pricing
                        </Link>
                        <a href="mailto:leadloomsg@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors">
                            Contact
                        </a>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-white dark:ring-gray-800 group-hover:ring-primary/30 transition-all">
                                        {getInitials()}
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                                        </div>
                                        <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </Link>
                                        <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <Settings size={16} /> Account Settings
                                        </Link>
                                        <Link to="/billing" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <CreditCard size={16} /> Billing & Subscription
                                        </Link>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        <Link to="/terms" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <FileText size={16} /> Terms of Service
                                        </Link>
                                        <Link to="/privacy" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <Shield size={16} /> Privacy Policy
                                        </Link>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                                            {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                        </button>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                                        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2.5">
                                <a
                                    href="https://calendly.com/thetpine254/30min"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-sm"
                                >
                                    Book Demo
                                </a>
                                <Link
                                    to="/login"
                                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                            Features
                        </Link>
                        <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                            Pricing
                        </Link>
                        {session ? (
                            <>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <div className="px-3 py-2 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">{getInitials()}</div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{session.user.email}</span>
                                </div>
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <Settings size={18} /> Settings
                                </Link>
                                <Link to="/billing" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <CreditCard size={18} /> Billing
                                </Link>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <FileText size={18} /> Terms of Service
                                </Link>
                                <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <Shield size={18} /> Privacy Policy
                                </Link>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </button>
                                <button
                                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <a href="mailto:leadloomsg@gmail.com" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Contact
                                </a>
                                <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>
                                <div className="space-y-2 pt-1">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-5 rounded-xl transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full flex justify-center bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
