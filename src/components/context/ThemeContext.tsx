"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
	theme: "light",
	toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as "light" | "dark";
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.classList.add(savedTheme);
		} else {
			document.documentElement.classList.add("light");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.classList.remove(theme);
		document.documentElement.classList.add(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
