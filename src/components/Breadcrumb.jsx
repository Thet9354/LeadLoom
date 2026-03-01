import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="flex items-center gap-1.5 text-sm mb-6">
            <Link to="/" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
                <Home size={14} />
            </Link>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
                    {i === items.length - 1 ? (
                        <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                    ) : (
                        <Link to={item.to} className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
