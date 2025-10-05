"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeButtons = () => {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="flex items-center justify-center w-10 h-10 rounded-full 
				bg-white/10 hover:bg-primary/20 
				data-[theme=dark]:hover:bg-primary/30 
				data-[theme=custom]:hover:bg-primary/25 
				data-[theme=pastel]:hover:bg-primary/15 
				transition-colors duration-300"
			data-theme={resolvedTheme || theme}
			aria-label="Toggle theme"
		>
			{isDark ? (
				<Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 rotate-0 scale-100" />
			) : (
				<Moon className="h-5 w-5 text-blue-400 transition-transform duration-300 rotate-0 scale-100" />
			)}
		</button>
	);
};
