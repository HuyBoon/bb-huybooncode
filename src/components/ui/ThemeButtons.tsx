"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeButtons = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    // Kiểm tra theme hiện tại
    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-full 
                bg-gray-100 hover:bg-gray-200 
                dark:bg-white/10 dark:hover:bg-primary/20 
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle theme"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`absolute inset-0 w-full h-full text-yellow-500 transition-all duration-300 
                    ${
                        isDark
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                    }`}
                />
                <Moon
                    className={`absolute inset-0 w-full h-full text-blue-400 transition-all duration-300 
                    ${
                        isDark
                            ? "rotate-0 scale-100 opacity-100"
                            : "-rotate-90 scale-0 opacity-0"
                    }`}
                />
            </div>
        </button>
    );
};
